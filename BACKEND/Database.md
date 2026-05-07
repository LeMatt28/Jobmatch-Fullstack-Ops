erDiagram
    Candidate {
        Int id PK
        String email
        String password
        String name
        String location
        String[] skills
        String experience
        String availability
        Int salaryExpected
        Boolean mobility
        String[] softSkills
        Float scoreCandidat
        Boolean isPremium
        DateTime createdAt
    }

    Company {
        Int id PK
        String email
        String password
        String name
        String sector
        String size
        String description
        String[] values
        Float scoreReliability
        SubscriptionTier subscriptionTier
        DateTime createdAt
    }

    Offer {
        Int id PK
        Int companyId FK
        String title
        String description
        String[] stack
        String location
        ContractType contractType
        Int salaryMin
        Int salaryMax
        String remote
        Boolean isActive
        DateTime createdAt
    }

    Swipe {
        Int id PK
        Int candidateId FK
        Int offerId FK
        SwipeDirection direction
        DateTime createdAt
    }

    Match {
        Int id PK
        Int candidateId FK
        Int offerId FK
        String messageIA
        MatchStatus status
        DateTime createdAt
    }

    CandidateReview {
        Int id PK
        Int candidateId FK
        Int companyId
        Int score
        String comment
        DateTime createdAt
    }

    CompanyReview {
        Int id PK
        Int companyId FK
        Int candidateId
        Int score
        String comment
        DateTime createdAt
    }

    Company ||--o{ Offer : "publie"
    Candidate ||--o{ Swipe : "swipe"
    Offer ||--o{ Swipe : "reçoit"
    Candidate ||--o{ Match : "a"
    Offer ||--o{ Match : "génère"
    Candidate ||--o{ CandidateReview : "reçoit"
    Company ||--o{ CompanyReview : "reçoit"
