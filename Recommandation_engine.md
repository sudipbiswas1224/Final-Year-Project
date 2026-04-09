# Mental Health Resource Authenticity Documentation

This document explains how the selected resources were evaluated for authenticity and lists the full resource set currently proposed for the app's recommendation engine. The resource strategy is designed around five assessment sources: PHQ-9, GAD-7, PSS, WHO-5, and ISI, with multi-tagging used whenever one resource is genuinely useful across more than one mental health domain.[1][2][3][4]

## Authenticity criteria

The resources were selected using a practical authenticity framework based on source credibility, clinical relevance, public accessibility, and appropriateness for a non-diagnostic wellbeing app.[1][2][3][5]

### 1. Official or institution-backed sources

Priority was given to resources from recognized public health and clinical institutions such as the National Institute of Mental Health (NIMH), the World Health Organization (WHO), the United Nations, the NHS, Mayo Clinic, and Therapist Aid because these organizations publish mental health content for education, self-help, and public support at scale.[1][2][4][3][5][6][7]

### 2. Direct resource URLs

Where video resources were included, the list uses direct video links rather than generic channel links so each item can be audited, previewed, and stored as a concrete recommendation object in the database.[8][9][10][11][12]

### 3. Domain fit with assessment instruments

Each resource was tagged to fit one or more assessment domains: depression with PHQ-9, anxiety with GAD-7, stress with PSS, wellbeing with WHO-5, and sleep or insomnia with ISI.[1][2][3][4] Multi-tagging was intentionally allowed because many evidence-informed self-help resources are relevant across overlapping problems such as anxiety, stress, and sleep disturbance.[13][14][15]

### 4. Safe educational or supportive scope

The selected resources are suitable for psychoeducation, coping support, guided relaxation, mindfulness, sleep preparation, and help-seeking. They are not presented as substitutes for diagnosis or emergency care, and severe cases should still surface professional or crisis-support pathways.[1][2][3][16]

### 5. Publicly accessible and reusable in an app context

Resources were chosen because they are publicly reachable on stable web pages or public video URLs, making them practical for use in a recommendation system where users click directly into content.[4][3][5][7]

## Why these sources are trustworthy

| Source type | Why it is considered authentic |
|---|---|
| NIMH | U.S. government mental health institute publishing condition overviews, care guidance, and public education materials.[1][2][13] |
| WHO | Global public health authority with public mental wellbeing guidance and topic pages.[4][3][14] |
| UN | Institutional overview page that aligns with global mental health and wellbeing framing.[17] |
| NHS | National public health self-help hub with stress, mood, and sleep support content.[5] |
| Mayo Clinic | Large clinical institution publishing practical, patient-facing self-help guidance such as mindfulness exercises.[18] |
| Therapist Aid | Widely used therapy support site offering structured worksheets and guided exercises like progressive muscle relaxation.[7][19] |
| Vandrevala Foundation | Real-world support access point for India-based mental health counselling and help-seeking support.[16] |
| Public YouTube resources | Included only when there is a direct, specific video URL and the content is clearly educational, relaxation-based, or coping-oriented.[8][9][11][20][21] |

## Full resource inventory

The following resources are the current curated set used across the five assessment areas. Multi-tagging is used when one resource fits multiple domains.

| Title | Type | URL | Suggested tags |
|---|---|---|---|
| Depression - National Institute of Mental Health | article | https://www.nimh.nih.gov/health/topics/depression | depression, phq9, wellbeing, who5 [1] |
| Depression - National Institute of Mental Health | article | https://www.nimh.nih.gov/health/publications/depression | depression, phq9 [22] |
| Anxiety Disorders - National Institute of Mental Health | article | https://www.nimh.nih.gov/health/topics/anxiety-disorders | anxiety, gad7, stress, pss, wellbeing, who5 [2] |
| Caring for Your Mental Health | article | https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health | wellbeing, who5, stress, pss, sleep, insomnia, isi, anxiety, gad7, depression, phq9 [13] |
| Mental well-being: resources for the public | article | https://www.who.int/news-room/feature-stories/mental-well-being-resources-for-the-public | wellbeing, who5, stress, pss, anxiety, gad7 [3] |
| Mental health | article | https://www.who.int/health-topics/mental-health | wellbeing, who5, stress, pss, depression, phq9, anxiety, gad7 [4] |
| Mental Health and Wellbeing | article | https://www.un.org/en/global-issues/mental-health | wellbeing, who5, stress, pss, anxiety, gad7 [17] |
| Every Mind Matters | article | https://www.nhs.uk/every-mind-matters/ | stress, pss, anxiety, gad7, depression, phq9, sleep, insomnia, isi, wellbeing, who5 [5] |
| Lifestyle to Support Mental Health | article | https://www.psychiatry.org/patients-families/lifestyle-to-support-mental-health | wellbeing, who5, stress, pss, sleep, isi [6] |
| Mindfulness exercises | activity | https://www.mayoclinic.org/tests-procedures/meditation/in-depth/mindfulness-exercises/art-20046356 | wellbeing, who5, stress, pss, sleep, insomnia, isi, anxiety, gad7 [18] |
| Progressive Muscle Relaxation Script | activity | https://www.therapistaid.com/therapy-worksheet/progressive-muscle-relaxation-script | stress, pss, anxiety, gad7, sleep, insomnia, isi, wellbeing, who5 [23] |
| Progressive Muscle Relaxation Exercise | activity | https://www.therapistaid.com/therapy-video/progressive-muscle-relaxation | stress, pss, anxiety, gad7, sleep, insomnia, isi, wellbeing, who5 [19] |
| A Body Scan Meditation to Prepare Mind and Body for Sleep | activity | https://www.mindful.org/a-body-scan-meditation-to-help-you-sleep/ | sleep, insomnia, isi, stress, pss, anxiety, gad7, wellbeing, who5 [24] |
| Guided Body Scan Meditation for Sleep | activity | https://www.youtube.com/watch?v=kPtVGqaMJAk | sleep, insomnia, isi, stress, pss, anxiety, gad7, wellbeing, who5 [25] |
| Progressive Muscle Relaxation for Sleep \| Full-Body Guided Meditation to Release Tension | activity | https://www.youtube.com/watch?v=kG3_bGadSJQ | sleep, insomnia, isi, stress, pss, anxiety, gad7, wellbeing, who5 [20] |
| Progressive Muscular Relaxation Guided Sleep Meditation for Anxiety & Insomnia Relief at Bedtime | activity | https://www.youtube.com/watch?v=y1TOqzOWV3M | sleep, insomnia, isi, anxiety, gad7, stress, pss, wellbeing, who5 [21] |
| What is anxiety? mental health minute with Kati Morton | video | https://www.youtube.com/watch?v=2oFZfe89VDU | anxiety, gad7, stress, pss [9] |
| 7 Proven Ways To Manage Anxiety | video | https://www.youtube.com/watch?v=whrN7ujh3Yk | anxiety, gad7, stress, pss, wellbeing, who5 [11] |
| What to do with Anxiety in Your Body | video | https://www.youtube.com/watch?v=-v34YfjfKUk&vl=en | anxiety, gad7, stress, pss, sleep, insomnia, isi [26] |
| Having a Panic Attack? The Anti-Struggle Technique | video | https://www.youtube.com/watch?v=2CQpyA485wc&vl=en | anxiety, gad7, stress, pss [27] |
| Depression, Anxiety and WHAT IS NORMAL | video | https://www.youtube.com/watch?v=U4JmP59SwRs | depression, phq9, anxiety, gad7, wellbeing, who5 [8] |
| How Your Anxiety May Lead to Depression | video | https://www.youtube.com/watch?v=jGCyQcvfsBQ | anxiety, gad7, depression, phq9, stress, pss [10] |
| Can You Fully Recover From Depression? | video | https://www.youtube.com/watch?v=3r1vz2ML-HI | depression, phq9, wellbeing, who5 [28] |
| Get Stress & Anxiety Relief with These Effective Ways to Reduce Stress | video | https://www.youtube.com/watch?v=YXhdbsa7HkA | stress, pss, anxiety, gad7, wellbeing, who5 [12] |
| FALL INTO SLEEP INSTANTLY Healing of Stress, Anxiety and Depressive States INSOMNIA RELIEF | music | https://www.youtube.com/watch?v=i9sR_T76H34 | sleep, insomnia, isi, stress, pss, anxiety, gad7, depression, phq9, wellbeing, who5 [29] |
| Beautiful Relaxing Music for Stress Relief ~ Calming Music | music | https://www.youtube.com/watch?v=lFcSrYw-ARY | stress, pss, sleep, insomnia, isi, wellbeing, who5, anxiety, gad7 [30] |
| Relaxing Music for Stress Relief. Calm Music for Meditation, Sleep | music | https://www.youtube.com/watch?v=sztFHij0_W0 | stress, pss, sleep, insomnia, isi, wellbeing, who5 [31] |
| Mindfulness Meditation Music for Focus, Concentration to Relax | music | https://www.youtube.com/watch?v=EkbM5EfFyME | wellbeing, who5, stress, pss [32] |
| Sound of Inner Peace 14 \| 528 Hz \| Relaxing Music | music | https://www.youtube.com/watch?v=FTqrQsSIKR0 | wellbeing, who5, stress, pss, sleep, insomnia, isi [33] |
| Free 24x7 Mental Health Counselling - Vandrevala Foundation | article | https://www.vandrevalafoundation.com/free-counseling | depression, phq9, anxiety, gad7, stress, pss, wellbeing, who5, sleep, insomnia, isi [16] |

## Notes for implementation

A resource does not need to belong to only one test bucket. In practice, a better recommendation model ranks items by the number of overlapping tags with the user's profile, then boosts exact severity matches, and finally falls back to broadly applicable resources tagged with `all` severity.[13][3][5]

For severe score patterns, self-help resources should be paired with a help-seeking or counselling resource so the app does not rely only on passive content recommendations.[1][2][16]