# Assessment-Based Recommendation Engine — Documentation

## 1. Overview

The recommendation engine is a rule-based content recommendation system that suggests curated mental health resources (articles, videos, guided activities, and music) to users based on their psychometric assessment results. The system supports five standardized, clinically-recognized assessments:

| Assessment | Full Name | Measures |
|---|---|---|
| PHQ-9 | Patient Health Questionnaire-9 | Depression symptom severity |
| GAD-7 | Generalized Anxiety Disorder-7 | Anxiety symptom severity |
| PSS | Perceived Stress Scale | Perceived stress levels |
| WHO-5 | WHO-5 Well-Being Index | General psychological wellbeing |
| ISI | Insomnia Severity Index | Sleep/insomnia severity |

The engine's goal is to close the loop between assessment and action: rather than simply reporting a score back to the user, it immediately surfaces relevant, credible, severity-appropriate self-help content — and it does so differently depending on whether the user has taken zero, one, or multiple assessments.

---

## 2. System Architecture

The engine consists of three main components:

1. **Resource Database** (`Resource` model, MongoDB) — a curated collection of external mental-health resources, each tagged by topic and target severity level.
2. **Assessment Result Store** (`AssessmentResult` model, MongoDB) — stores each completed assessment attempt per user, including test type, raw score, and a human-readable severity interpretation.
3. **Recommendation Service** (`recommendationService.js`) — the core logic layer that queries both of the above, applies severity mapping and relevance scoring, and returns a ranked, grouped set of recommendations.

### Data Flow

```
User completes assessment(s)
        ↓
AssessmentResult saved to MongoDB (per test type, timestamped)
        ↓
getRecommendationsForUser(userId) called
        ↓
Fetch latest result for EACH test type the user has taken
        ↓
For each result: map test type → topic tags, map interpretation → normalized severity
        ↓
Query Resource collection using combined tag + severity conditions
        ↓
Score and rank candidate resources by relevance
        ↓
Apply severity safety-net check
        ↓
Group results by content type (video / article / activity / music)
        ↓
Return to frontend
```

---

## 3. Resource Database

Each resource document follows this schema:

| Field | Description |
|---|---|
| `title` | Display name of the resource |
| `description` | Short summary of the content |
| `url` | Link to the original source |
| `type` | Content format: `article`, `video`, `activity`, or `music` |
| `tags` | Topic keywords used for matching (e.g., `depression`, `phq9`, `sleep`) |
| `targetSeverity` | Which severity tier the resource is best suited for: `mild`, `moderate`, `severe`, or `all` |

### 3.1 Source Authenticity

All resources are drawn from recognized institutional, clinical, or professionally-credentialed sources, to ensure users are directed toward reliable information rather than unverified content. Sources used:

**Institutional / Government Health Bodies**
- National Institute of Mental Health (NIMH) — https://www.nimh.nih.gov
- World Health Organization (WHO) — https://www.who.int
- United Nations (UN) — https://www.un.org
- UK National Health Service (NHS) — https://www.nhs.uk
- US Centers for Disease Control and Prevention (CDC) — https://www.cdc.gov
- National Institute of Neurological Disorders and Stroke (NINDS) — https://www.ninds.nih.gov
- American Psychological Association (APA) — https://www.apa.org

**Clinical / Professional Platforms**
- Mayo Clinic — https://www.mayoclinic.org
- Therapist Aid (clinician-built therapy resource platform) — https://www.therapistaid.com
- Mindful.org (established mindfulness publication) — https://www.mindful.org
- Vandrevala Foundation (24x7 mental health helpline, India) — https://www.vandrevalafoundation.com
- WHO-5 official index maintainers (Psykiatri Region H) — https://www.psykiatri-regionh.dk/who-5/

**Supplementary Self-Help Media**
- YouTube content from licensed/credentialed creators (e.g., Kati Morton, a licensed therapist) and established guided-meditation/relaxation channels — used for guided exercises and psychoeducation, supplementary to the institutional articles above.

### 3.2 Resource Coverage by Assessment

| Assessment | Topic Tags | Severity Tiers Covered |
|---|---|---|
| PHQ-9 | `depression`, `phq9` | mild, moderate, severe, all |
| GAD-7 | `anxiety`, `gad7` | mild, moderate, severe, all |
| PSS | `stress`, `pss` | mild, moderate, severe, all |
| WHO-5 | `wellbeing`, `who5` | mild, moderate, severe, all |
| ISI | `sleep`, `insomnia`, `isi` | mild, moderate, severe, all |

---

## 4. Recommendation Mechanism

### 4.1 Two User Pathways

**Pathway A — User has not taken any assessment**
The system returns general wellbeing-oriented resources (tagged `wellbeing` / `who5`, `targetSeverity: all`), so a first-time user still receives useful, non-clinical content rather than an empty state.

**Pathway B — User has taken one or more assessments**
The system fetches the *most recent result for every test type the user has completed* — not just the single latest assessment overall. This ensures that if a user has, for example, taken both PHQ-9 and GAD-7, recommendations reflect both results rather than only whichever was completed most recently.

### 4.2 Severity Normalization

Each assessment type uses different wording in its result interpretation (e.g., PHQ-9 says "Moderately Severe", PSS says "High Perceived Stress", WHO-5 says "Poor Wellbeing"). Because of this, the system applies a **per-test-type severity mapping function** that normalizes every possible interpretation string into one of three standard tiers: `mild`, `moderate`, or `severe`. This ensures consistent, comparable severity handling across all five assessment types, rather than relying on a single generic keyword check that would misclassify non-PHQ9/GAD7-style wording.

### 4.3 Tag and Severity Matching

For each completed assessment, the system builds a query condition combining:
- The relevant **topic tags** for that test type (e.g., ISI → `sleep`, `insomnia`, `isi`)
- The **normalized severity tier**, matched against resources tagged with that tier *or* tagged `all` (general-purpose resources applicable regardless of severity)

These conditions are combined across all of the user's completed assessments using a logical OR, so the candidate resource pool draws from every assessment area the user has engaged with.

### 4.4 Relevance Scoring and Ranking

Rather than returning resources in arbitrary database order, each candidate resource is scored based on:
- **Tag overlap** — how many of its tags match the user's assessment-derived tags (higher overlap = more relevant)
- **Severity match bonus** — additional weight if the resource's `targetSeverity` exactly matches the user's severity tier for that assessment, with more weight given to higher severity matches

Resources are then sorted by total score, deduplicated (in case one resource matches multiple assessments), and the top results are retained.

### 4.5 Severity Safety Net

If any of the user's assessments returned a `severe` classification, the system explicitly verifies that at least one `severe`-tier resource is present in the final recommendation set. If the scoring/ranking process did not naturally surface one, it is inserted at the top of the list. This ensures higher-risk users are never presented with only mild-tier content due to an artifact of the ranking algorithm.

### 4.6 Output Grouping

The final recommendation list is grouped by content type for frontend display:
```
{
  videos: [...],
  articles: [...],
  activities: [...],
  music: [...]
}
```

---

## 5. Example Flow

**Scenario**: A user completes PHQ-9 (result: "Moderately Severe") and ISI (result: "Moderate clinical insomnia").

1. System fetches latest PHQ-9 and ISI results for this user.
2. PHQ-9 → tags: `depression`, `phq9`; severity: `severe`
3. ISI → tags: `sleep`, `insomnia`, `isi`; severity: `moderate`
4. Query pulls candidate resources matching either condition set.
5. Resources are scored — e.g., an NHS depression article tagged `depression`, `phq9`, `targetSeverity: severe` scores highly against the PHQ-9 condition.
6. Final list is deduplicated, sorted, and severity-checked (severe-tier PHQ-9 resource guaranteed present).
7. Grouped output returned: e.g., 3 articles, 2 videos, 1 activity relevant to depression and sleep concerns.

---

## 6. Design Rationale

- **Per-test-type fetching** (rather than single latest result) avoids losing relevant context when users take multiple assessments over time.
- **Per-test severity normalization** was necessary because clinical assessments use different result vocabularies; a one-size-fits-all keyword match under-classified non-PHQ9/GAD7 results.
- **Scoring over raw querying** ensures the most topically and severity-relevant content surfaces first, rather than whatever the database happens to return first.
- **Severity safety net** reflects a deliberate design choice to bias toward caution: in a mental health context, it is safer to over-surface higher-severity support content than to risk a high-severity user only seeing generic self-help material.
- **Institutional sourcing** ensures the platform is directing users toward information that is medically and psychologically credible, which is especially important given the sensitive nature of the content domain.

---

## 7. Future Improvements

- Incorporate **trend analysis** across repeated assessments over time (e.g., worsening or improving scores) to further refine recommendations.
- Add **user feedback loops** (e.g., "was this helpful?") to improve resource ranking over time.
- Expand resource coverage with **localized/regional resources** based on user location.
- Consider a **hybrid retrieval approach** (combining this rule-based system with semantic/embedding-based matching) for more nuanced content-to-need matching as the resource database grows.