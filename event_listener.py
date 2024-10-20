import requests
from web3 import Web3
from sklearn.feature_extraction.text import TfidfVectorizer
import time
import logging
import joblib
from lighthouseweb3 import Lighthouse
from transformers import pipeline
from collections import Counter
import os
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger()

infura_url = os.getenv("INFURA_URL")
web3 = Web3(Web3.HTTPProvider(infura_url))


lh = Lighthouse(token=os.getenv("LIGHTHOUSE_TOKEN"))

sentiment_analysis_models_cid = ['bafybeiayqxxlfvxpjq6t6ktehanjfo5fb7s7pul2uyiusofy37ypliemta','bafkreicawkvmezaf4xsipcdtdkt5uzt6atidg4dw3sl6l6d3klxvml7ujy','bafybeigif7joixms7h46meybgkcamjp6ks2ghdoa5fhwi4z4riu3ub5nzi']
spam_detection_models_cid = ['bafkreigjqntvkc73or473l4aihelsdzczp7jynf24z3ny45hgcut2747eq','bafkreiglomol3jw7usoz6i5m65m3ips3myv2gpmcfhi7wampamxxfeo3te','bafybeihvtuuu4eyc7lebwic5rwdzegc53tpaq7ejwhghldoahxfo2oio4e']
language_detection_models_cid = ['bafybeiaehb3knspz7ba6jqyvq76jegjofm46ogbtuzgxuj6eflanz5iy3m','bafybeigxh3jctx7am5kxaw7pfaxfxvpvwcjykzdyylz7rr5ckr2vgjp57u','bafybeihad266fd25zpzrfbiiz6hrgdc73oc2d7mmhxs6smlwbuz327h6lu']


sentiment_analysis = {}
language_detection = {}
spam_detection = {}


#functions to load all the models related to that topic and store them in a dictionary


def sentiment_analysis_model_load():
    for i in range(len(sentiment_analysis_models_cid)):
        file_info = lh.download(sentiment_analysis_models_cid[i])
        destination_path = f'./downloaded_setiment_analysis{i}.pkl'
        file_content = file_info[0]

        with open(destination_path , 'wb') as destination_file:
            destination_file.write(file_content)


        with open(destination_path , 'rb') as model_file:
            model = joblib.load(model_file)

        sentiment_analysis[i] = model
    return sentiment_analysis

def spam_detection_model_load() :
    spam_detection_values = []
    for i in range(len(spam_detection_models_cid)):

        file_info = lh.download(spam_detection_models_cid[i])
        destination_path = f'./downloaded_spam_detection{i}.pkl'
        file_content = file_info[0]

        with open(destination_path , 'wb') as destination_file:
            destination_file.write(file_content)


        with open(destination_path , 'rb') as model_file:
            model = joblib.load(model_file)

        spam_detection[i] = model

    return spam_detection




def language_detection_model_load() :
    for i in range(len(language_detection_models_cid)):
        file_info = lh.download(language_detection_models_cid[i])
        destination_path = f'./downloaded_language_detection{i}.pkl'
        file_content = file_info[0]

        with open(destination_path , 'wb') as destination_file:
            destination_file.write(file_content)


        with open(destination_path , 'rb') as model_file:
            model = joblib.load(model_file)

        language_detection[i] = model

    return language_detection




# Ensure the connection is successful
if web3.is_connected():
    print("Connected to Ethereum network")
else:
    print("Connection failed")
    exit()


# Replace with your contract's deployed address and ABI
contract_address = os.getenv("CONTRACT_ADDRESS")
contract_abi =[{"anonymous":False,"inputs":[{"indexed":False,"internalType":"string","name":"processedContent","type":"string"}],"name":"PredictionProcessed","type":"event"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"address","name":"requester","type":"address"},{"indexed":False,"internalType":"string","name":"content","type":"string"},{"indexed":False,"internalType":"string","name":"content2","type":"string"}],"name":"PredictionRequested","type":"event"},{"inputs":[{"internalType":"string","name":"content1","type":"string"},{"internalType":"string","name":"content2","type":"string"}],"name":"requestPrediction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"processedContent","type":"string"}],"name":"storePrediction","outputs":[],"stateMutability":"nonpayable","type":"function"}]

contract = web3.eth.contract(address=contract_address, abi=contract_abi)

# Function to handle the event
def preprocess_and_send_to_model(content1,content2):
    # logger.info("preprocessing started")
 
    available_models = ["sentiment analysis", "language detection", "spam detection"]
    # best_match_model = "language detection"

# Load the zero-shot classification pipeline

    classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

    result = classifier(content1, available_models)

    best_match_model = result["labels"][0]


    if best_match_model == "sentiment analysis":

        dictionary = sentiment_analysis_model_load()

        predictions = []
        for model_name , model in dictionary.items():
            prediction =  model.predict([content2])
            predictions.append(tuple(prediction))


        final_output = Counter(predictions).most_common(1)[0][0]

        return final_output[0]



    elif best_match_model == "language detection":
        dictionary = language_detection_model_load()
        print(content2)


        predictions = []
        for model_name , model in dictionary.items():
            prediction =  model.predict([content2])
            predictions.append(tuple(prediction))

        final_output = Counter(predictions).most_common(1)[0][0]
        print(final_output)


        return final_output[0]



    elif best_match_model == "spam detection":
        dictionary = spam_detection_model_load()
        print(content2)

        predictions = []
        for model_name , model in dictionary.items():
            prediction =  model.predict([content2])
            predictions.append(tuple(prediction))
            


        final_output = Counter(predictions).most_common(1)[0][0]

        return final_output[0]
    



    

# Listen for PredictionRequested events and process the input
def listen_for_predictions():
    
    event_filter = contract.events.PredictionRequested.create_filter(from_block='latest')
    print("Listening for PredictionRequested events...")
    while True:
        for event in event_filter.get_new_entries():
            requester = event['args']['requester']
            content1 = event['args']['content']
            content2 = event['args']['content']
            # print(f"Prediction requested by {requester}: {content1}")


            # Preprocess the content and send it to the AI model on IPFS
            processed_content = preprocess_and_send_to_model(content1,content2)
            if processed_content is not None:
                send_processed_prediction(processed_content, requester)
            else:
                logger.warning("Processed content is None; skipping sending to smart contract.")

            # send_processed_prediction(processed_content, requester)
        # Sleep for a while to avoid overwhelming the node
        time.sleep(10)

def send_processed_prediction(processed_content, user_address):
    print(f"Sending processed content back to smart contract for user {user_address}: {processed_content}")
    
    try:
        # Build the transaction
        txn = contract.functions.storePrediction(processed_content).build_transaction({
            'from': user_address,
            'nonce': web3.eth.get_transaction_count(user_address),
            'gas': 2000000,
            'gasPrice': web3.to_wei('20', 'gwei')
        })

        print(f"Transaction details: {txn}")

        # Sign the transaction
        private_key = os.getenv("PRIVATE_KEY")
        signed_txn = web3.eth.account.sign_transaction(txn, _privatekey=private_key)

        # Send the signed transaction
        tx_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)

        # print(f"Transaction sent! Hash: {web3.to_hex(tx_hash)}")

    except Exception as e:
        print(f"Error signing or sending transaction: {e}")



if __name__ == "__main__":
    # Start listening for PredictionRequested events
    listen_for_predictions()








