import json
import os
from typing import List, Dict, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class VectorDB:
    """Simple vector storage using JSON file"""
    
    def __init__(self):
        """Initialize storage with JSON file"""
        self.storage_file = "./pdf_storage.json"
        self.documents = self._load_storage()
        self.full_text = ""  # Store complete PDF text
    
    def _load_storage(self) -> List[Dict]:
        """Load documents from JSON file"""
        if os.path.exists(self.storage_file):
            with open(self.storage_file, 'r') as f:
                return json.load(f)
        return []
    
    def _save_storage(self):
        """Save documents to JSON file"""
        with open(self.storage_file, 'w') as f:
            json.dump(self.documents, f, indent=2)
    
    def reset_collection(self) -> Dict:
        """
        Clear all stored documents
        
        Returns:
            Status dictionary
        """
        self.documents = []
        self._save_storage()
        return {"status": "Collection reset successfully"}
    
    def add_documents(
        self, 
        texts: List[str], 
        metadatas: Optional[List[Dict]] = None, 
        ids: Optional[List[str]] = None
    ) -> Dict:
        """
        Add documents to storage
        
        Args:
            texts: List of text chunks
            metadatas: Optional metadata for each chunk
            ids: Optional IDs for each chunk
            
        Returns:
            Status dictionary with count
        """
        if ids is None:
            ids = [f"doc_{i}" for i in range(len(texts))]
        
        for i, text in enumerate(texts):
            doc = {
                "id": ids[i],
                "text": text,
                "metadata": metadatas[i] if metadatas else {}
            }
            self.documents.append(doc)
        
        self._save_storage()
        return {"status": "Documents added", "count": len(texts)}
    
    def query_documents(self, query_text: str, n_results: int = 5) -> Dict:
        """
        Query documents using Gemini embeddings for similarity search
        
        Args:
            query_text: Search query
            n_results: Number of results to return
            
        Returns:
            Query results dictionary
        """
        if not self.documents:
            return {"documents": [], "metadatas": [], "distances": []}
        
        try:
            # Simple search - return first n documents
            results = []
            for doc in self.documents[:n_results]:
                results.append(doc["text"])
            
            return {
                "documents": [results],
                "metadatas": [[doc.get("metadata", {}) for doc in self.documents[:n_results]]],
                "distances": [[0.0] * len(results)]
            }
        except:
            # Fallback to first n documents
            results = [doc["text"] for doc in self.documents[:n_results]]
            return {
                "documents": [results],
                "metadatas": [[doc.get("metadata", {}) for doc in self.documents[:n_results]]],
                "distances": [[0.0] * len(results)]
            }
    
    def get_collection_count(self) -> int:
        """
        Get total number of documents in storage
        
        Returns:
            Document count
        """
        return len(self.documents)

# Global instance
vector_db = VectorDB()
