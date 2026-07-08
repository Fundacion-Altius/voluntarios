# Branching Strategy Visual Diagram

## Current vs Proposed Branching Strategy

### 📊 Current Branch Structure (Before Consolidation)

```mermaid
%%{init: {'theme': 'base', 'gitGraph': {'showCommitLabel': false, 'mainBranchName': 'Current Structure'}}}%%
gitGraph
    commit id: "main-1" tag: "main (production)" type: HIGHLIGHT
    branch dev
    commit id: "dev-1" tag: "dev (development)" type: REVERSE
    branch deploy-v2
    commit id: "deploy-1" tag: "deploy-v2 (staging?)"
    branch build
    commit id: "build-1" tag: "build (artifacts)"
    branch feat/survey-email
    commit id: "feat-1" tag: "feat/survey-email"
    branch temp
    commit id: "temp-1" tag: "temp"
    branch ls
    commit id: "ls-1" tag: "ls"
    branch rebase-temp
    commit id: "rebase-1" tag: "rebase-temp"
    checkout main
    commit id: "main-2"
    checkout dev
    commit id: "dev-2"
    checkout deploy-v2
    merge main id: "merge-main-deploy"
    commit id: "deploy-2"
    checkout main
    commit id: "main-3"

    %% Styling
    commit "main-1": "🟢 Production"
    commit "dev-1": "🟡 Development"
    commit "deploy-1": "🔵 Staging?"
    commit "build-1": "⚪ Build"
    commit "feat-1": "🟣 Feature"
    commit "temp-1": "⚫ Temp"
    commit "ls-1": "⚫ Temp"
    commit "rebase-1": "⚫ Temp"
```

**Current Structure Issues:**
- ❌ Multiple "stable" branches with unclear purposes
- ❌ No clear promotion path (dev → deploy-v2 → main?)
- ❌ Temporary branches clutter the repository
- ❌ build branch stores artifacts (wrong place)
- ❌ Divergent histories between main and dev
- ❌ No branch protection

### 🎯 Proposed Branch Structure (After Consolidation)

```mermaid
%%{init: {'theme': 'base', 'gitGraph': {'showCommitLabel': false, 'mainBranchName': 'New Structure'}}}%%
gitGraph
    commit id: "main-v1" tag: "main (production)" type: HIGHLIGHT
    branch dev
    commit id: "dev-v1" tag: "dev (integration)" type: REVERSE
    branch feat/admin-ui
    commit id: "admin-v1"
    commit id: "admin-v2"
    checkout dev
    merge feat/admin-ui id: "merge-admin"
    branch feat/survey-improvements
    commit id: "survey-v1"
    commit id: "survey-v2"
    checkout dev
    merge feat/survey-improvements id: "merge-survey"
    branch release/v1.2.0
    commit id: "release-v1"
    checkout main
    merge release/v1.2.0 id: "prod-release"
    commit id: "main-v2" tag: "v1.2.0"
    branch hotfix/critical-fix
    commit id: "hotfix-v1"
    checkout main
    merge hotfix/critical-fix id: "hotfix-merge-main"
    commit id: "main-v3" tag: "v1.2.1"
    checkout dev
    merge hotfix/critical-fix id: "hotfix-merge-dev"

    %% Styling
    commit "main-v1": "🟢 Production (Protected)"
    commit "dev-v1": "🟡 Integration (Protected)"
    commit "admin-v1": "🟣 Feature Branch"
    commit "survey-v1": "🟣 Feature Branch"
    commit "release-v1": "🟠 Release Candidate"
    commit "hotfix-v1": "🔴 Hotfix"
```

**New Structure Benefits:**
- ✅ Clear hierarchy: main → dev → feat/*
- ✅ Defined promotion path: feat/* → dev → main
- ✅ Branch protection: main and dev protected
- ✅ Feature isolation: All development in feat/* branches
- ✅ Clean structure: No temporary or artifact branches
- ✅ Hotfix support: Emergency fixes from main

### 🔄 Migration Path

```mermaid
flowchart TD
    A[Current State] --> B[Document Current Branches]
    B --> C[Backup All Branches]
    C --> D[Merge deploy-v2 → dev]
    D --> E[Delete Unnecessary Branches]
    E --> F[Set Up Branch Protection]
    F --> G[Update CI/CD Pipelines]
    G --> H[Team Training]
    H --> I[New Strategy Active]

    subgraph Current
    A1[main] -->|production| A
    A2[dev] -->|development| A
    A3[deploy-v2] -->|staging| A
    A4[build] -->|artifacts| A
    A5[feat/survey-email] -->|feature| A
    A6[temp/ls/rebase-temp] -->|temporary| A
    end

    subgraph New
    I1[main] -->|production| I
    I2[dev] -->|integration| I
    I3[feat/*] -->|features| I
    I4[release/*] -->|releases| I
    I5[hotfix/*] -->|hotfixes| I
    end

    style A fill:#ff9999,stroke:#333
    style I fill:#99ff99,stroke:#333
```

### 📋 Branch Lifecycle Comparison

#### Current Workflow
```mermaid
flowchart LR
    A[Idea] -->|?| B[Create Branch]
    B -->|?| C[Develop]
    C -->|?| D[Merge to...?]
    D -->|?| E[Deploy...?]
```

#### New Workflow
```mermaid
flowchart LR
    A[Idea] -->|openspec propose| B[feat/feature-name]
    B -->|develop| C[Complete Tasks]
    C -->|openspec archive| D[Merge to dev]
    D -->|integrate| E[dev branch]
    E -->|release process| F[release/vX.Y.Z]
    F -->|test| G[Merge to main]
    G -->|deploy| H[Production]
    H -->|tag| I[vX.Y.Z]
```

### 🛡️ Branch Protection Rules

#### Current State
```mermaid
pie title Branch Protection Status
    "No Protection" : 100
```

#### New Strategy
```mermaid
pie title Branch Protection Status
    "main (Strict)" : 30
    "dev (Moderate)" : 30
    "feat/* (None)" : 40
```

### 🎨 Color-Coded Branch Types

```mermaid
graph LR
    A[🟢 main] -->|Production| B((Deployed))
    C[🟡 dev] -->|Integration| D((Staging))
    E[🟣 feat/*] -->|Development| F((Isolated))
    G[🟠 release/*] -->|Candidate| H((Testing))
    I[🔴 hotfix/*] -->|Emergency| J((Immediate))
```

### 📊 Branch Type Statistics

#### Current Repository
```mermaid
pie title Current Branch Distribution
    "Long-lived" : 60
    "Feature" : 10
    "Temporary" : 20
    "Build" : 10
```

#### After Consolidation
```mermaid
pie title Target Branch Distribution
    "main" : 25
    "dev" : 25
    "feat/*" : 40
    "release/*" : 5
    "hotfix/*" : 5
```

### 🔗 OpenSpec Integration Flow

```mermaid
flowchart TD
    A[openspec propose "feature"] --> B[Suggest: feat/feature]
    B --> C[git checkout -b feat/feature dev]
    C --> D[Implement tasks]
    D --> E[openspec archive-change]
    E --> F[Create PR: feat/feature → dev]
    F --> G[Merge to dev]
    G --> H[Delete feat/feature]
    H --> I[Update main specs]
```

### 🚀 Workflow Benefits Visualization

```mermaid
graph TD
    A[Before] -->|❌| B[Confusing]
    A -->|❌| C[Risky]
    A -->|❌| D[Inconsistent]
    
    E[After] -->|✅| F[Clear]
    E -->|✅| G[Safe]
    E -->|✅| H[Consistent]
    E -->|✅| I[Traceable]
    E -->|✅| J[Scalable]
```

### 📈 Expected Improvements

```mermaid
barChart
    title Branch Strategy Metrics
    x-axis [Current, After]
    y-axis "Score (1-10)"
    bar ["Clarity", 3, 9]
    bar ["Safety", 4, 8]
    bar ["Consistency", 2, 9]
    bar ["Traceability", 3, 9]
    bar ["Team Adoption", 5, 8]
```

### 🎯 Summary Visual

```mermaid
mindmap
    root((Branching Strategy))
      Current
        ❌ Multiple stable branches
        ❌ Unclear promotion path
        ❌ No protection
        ❌ Divergent histories
      
      New
        ✅ Clear hierarchy
        ✅ Defined workflow
        ✅ Branch protection
        ✅ Feature isolation
        ✅ OpenSpec integration
      
      Migration
        🔄 Merge deploy-v2 → dev
        ❌ Delete temp branches
        🛡️ Add protection rules
        📚 Update documentation
        👥 Train team
```