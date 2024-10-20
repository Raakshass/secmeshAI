# Decentralized AI System

This project decentralizes AI by enabling users to interact with a backend consisting of various AI models. The system dynamically selects the best models based on user input and executes them in parallel, returning the optimal output via a *max-voting mechanism*. Users can also upload their own models, contributing to the system’s ability to make better predictions.

We needed to execute our Python file in a trustless execution environment (TEE). Unfortunately, we couldn't find a suitable TEE for Python (for instance, Phala supports JavaScript execution but not Python, making it unusable for our case). As a result, we ran the code on our localhost for the time being. However, if a TEE that supports Python becomes available, we can run it there as well.

---

## *Features*

1. *User Registration and MetaMask Integration*
   - Sign up and authenticate using MetaMask for decentralized authentication.
   - Connect your wallet to interact with the platform.

2. *Task Matching with Zero-Shot Classification*
   - The system uses *Zero-Shot Classification* powered by a *pre-trained BART model* fine-tuned on the *Multi-Genre Natural Language Inference (MNLI) dataset*.
   - Based on the user query, the system classifies the query into predefined tasks (e.g., spam detection, language detection, etc.).

3. *Model Execution*
   - Once the task is identified, multiple models are selected, and the query is executed in parallel.

4. *Max-Voting System for Output*
   - A *max-voting mechanism* is applied to aggregate results from various models, ensuring that the most frequent prediction is selected as the final output.

5. *Model Uploads by Users*
   - Users can upload their own models (e.g., trained *SVM, **RandomForest*) to the system.
   - Models are stored using *Content Identifiers (CIDs)* in a decentralized JSON-based database.

---

## *How It Works*

### 1. *Sign Up and Login*
   - Users sign up using MetaMask, connecting their wallet for authentication and enabling access to the decentralized platform.

### 2. *Submit a Query*
   - Users can submit a query like “Detect the language of this text”.
   - The query is analyzed by the *Zero-Shot Classification Pipeline, powered by a **BART model* fine-tuned on the *MNLI dataset*.

### 3. *Task Matching with Zero-Shot Classification*
   - The *Zero-Shot Classification* system classifies the query into a specific task, such as *spam detection, **language detection, **image classification*, etc., using predefined task labels.
   - Based on the task classification, the system selects appropriate models for execution.

### 4. *Model Execution*
   - The selected models (e.g., *SVM, **RandomForest*) are executed in parallel.
   - The results from the models are then aggregated.

### 5. *Max-Voting System*
   - After model execution, the predictions are aggregated using a *max-voting mechanism*. The most frequently predicted result is chosen as the final output.

### 6. *Model Uploads*
   - Users can upload their own pre-trained models (e.g., *SVM, **RandomForest*) for inclusion in the system.
   - Uploaded models are stored in the decentralized database with *CIDs (Content Identifiers)* for easy retrieval and use.

---

## *Technologies Used*

- *Zero-Shot Classification Pipeline: Powered by a **pre-trained BART model* fine-tuned on the *Multi-Genre Natural Language Inference (MNLI)* dataset for task classification.
- *Flask*: Backend framework to manage API requests and serve the platform.
- *MetaMask*: Enables decentralized authentication and wallet management.
- *Hugging Face: Libraries for implementing the **Zero-Shot Classification Pipeline* and leveraging the BART model.
- *Scikit-Learn: For machine learning models such as **SVM* and *RandomForest*.
- *Joblib*: For saving and loading machine learning models.
- *smart contracts*: Facilitate secure interactions between the frontend and backend, handling queries and model execution.
- *Next.js*:Framework for building the frontend.
- *tailwind-css*

---

## *Usage*

### 1. *Signup and Query Submission*
   - Connect to MetaMask to authenticate your identity.
   - Submit a query through the platform’s user interface (e.g., "Classify the text language").

### 2. *Task Classification and Model Execution*
   - The *Zero-Shot Classification* pipeline classifies the query into the appropriate task (e.g., language detection, spam detection).
   - The system then selects models corresponding to the task and runs them in parallel.

### 3. *Max Voting System*
   - Once the models return their predictions, the *max-voting system* selects the most frequent prediction as the final output.

### 4. *Uploading a Model*
   - Users can upload their trained models (e.g., *SVM, **RandomForest*) through the platform.
   - These models are stored using *CIDs* for future tasks.

---

## *Max-Voting System*
   The *max-voting* mechanism ensures that predictions from multiple models are aggregated and the most commonly predicted result is chosen. This approach helps improve accuracy and reliability by considering results from multiple models.

---

---
