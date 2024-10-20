// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract TextProcessor {
    // Event that is emitted when a prediction request is made
    event PredictionRequested(address indexed requester, string content, string content2);

    // Result emitted when the prediction is processed
    event PredictionProcessed(string processedContent);


    // Function that the frontend calls to request prediction
    function requestPrediction(string memory content1, string memory content2) public {
        // Emit the event with both arguments
        emit PredictionRequested(msg.sender, content1, content2);
    }

    // Function to store or emit the preprocessed result from the backend
    function storePrediction(string memory processedContent) public {
        emit PredictionProcessed(processedContent);
    }
}