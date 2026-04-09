const AssessmentResult = require('../models/AssessmentResult');
const Resource = require('../models/Resource');

/**
 * Maps a test score severity to the 'targetSeverity' field in the Resource schema.
 * Assuming tests return a severity string like "Mild", "Moderate", "Moderately Severe", "Severe".
 * @param {string} severity 
 * @returns {string} 'mild', 'moderate', or 'severe'
 */
const mapSeverity = (severity) => {
    if (!severity) return 'mild';
    const s = severity.toLowerCase();
    if (s.includes('severe')) return 'severe';
    if (s.includes('moderate')) return 'moderate';
    return 'mild'; // Fallback
};

/**
 * Maps test types to common tags in the resources DB.
 */
const mapTestTypeToTags = (testType) => {
    const map = {
        'phq9': ['depression', 'phq9'],
        'gad7': ['anxiety', 'gad7'],
        'pss': ['stress', 'pss'],
        'who5': ['wellbeing', 'who5'],
        'isi': ['sleep', 'insomnia', 'isi']
    };
    return map[testType.toLowerCase()] || [];
};

exports.getRecommendationsForUser = async (userId) => {
    try {
        // Get the user's most recent completed assessment result
        const latestResult = await AssessmentResult.findOne({ userId: userId })
            .sort({ date: -1 })
            .exec();
        //console.log('Latest Assessment Result:', latestResult);

        let searchTags = [];
        let searchSeverity = 'mild';

        if (latestResult) {
            searchTags = mapTestTypeToTags(latestResult.testType);
            searchSeverity = mapSeverity(latestResult.interpretation);
        } else {
            // Default general recommendations if they haven't taken a test
            searchTags = ['wellbeing', 'stress', 'mindfulness'];
        }
        //console.log('Search Tags:', searchTags, 'Search Severity:', searchSeverity);

        // Query resources matching tags OR matching the specific severity
        // (We also include 'all' targetSeverity to give general health tips)
        const query = {
            $or: [
                { tags: { $in: searchTags } }, // Match by tags
            ],
            targetSeverity: { $in: [searchSeverity, 'all'] }
        };

        // Return mixed types (videos, articles) limit 10
        const recommendations = await Resource.find(query).limit(10).exec();
        //console.log(recommendations);

        // Group them for easier frontend display
        const grouped = {
            videos: recommendations.filter(r => r.type === 'video'),
            articles: recommendations.filter(r => r.type === 'article'),
            activities: recommendations.filter(r => r.type === 'activity'),
            music: recommendations.filter(r => r.type === 'music')
        };

        return grouped;

    } catch (error) {
        console.error('Recommendation Service Error:', error);
        throw error;
    }
};
