import httpx
import json
from typing import List, Dict, Optional
from sentence_transformers import SentenceTransformer
import os


class EndeeService:
    """Service for interacting with Endee vector database"""
    
    def __init__(self):
        self.host = os.getenv("ENDEE_HOST", "localhost")
        self.port = os.getenv("ENDEE_PORT", "8001")
        self.base_url = f"http://{self.host}:{self.port}"
        self.collection = os.getenv("ENDEE_COLLECTION", "contract_clauses")
        
        # Initialize embedding model
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        
    async def create_collection(self) -> bool:
        """Create collection in Endee if it doesn't exist"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/collections",
                    json={
                        "name": self.collection,
                        "dimension": 384,  # all-MiniLM-L6-v2 dimension
                        "metric": "cosine"
                    }
                )
                return response.status_code in [200, 201, 409]  # 409 = already exists
        except Exception as e:
            print(f"Error creating collection: {e}")
            return False
    
    def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding vector for text"""
        embedding = self.model.encode(text)
        return embedding.tolist()
    
    async def insert_clause(
        self, 
        clause_id: str, 
        text: str, 
        metadata: Dict
    ) -> bool:
        """
        Insert clause embedding into Endee
        
        Args:
            clause_id: Unique identifier for the clause
            text: Clause text
            metadata: Additional metadata (type, contract_id, etc.)
        """
        try:
            embedding = self.generate_embedding(text)
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/collections/{self.collection}/points",
                    json={
                        "id": clause_id,
                        "vector": embedding,
                        "metadata": {
                            "text": text,
                            **metadata
                        }
                    }
                )
                return response.status_code in [200, 201]
        except Exception as e:
            print(f"Error inserting clause: {e}")
            return False

    
    async def search_similar_clauses(
        self, 
        query_text: str, 
        top_k: int = 5,
        filter_metadata: Optional[Dict] = None
    ) -> List[Dict]:
        """
        Search for similar clauses using semantic search
        
        Args:
            query_text: Text to search for
            top_k: Number of results to return
            filter_metadata: Optional metadata filters
            
        Returns:
            List of similar clauses with scores
        """
        try:
            query_embedding = self.generate_embedding(query_text)
            
            async with httpx.AsyncClient() as client:
                payload = {
                    "vector": query_embedding,
                    "top_k": top_k
                }
                
                if filter_metadata:
                    payload["filter"] = filter_metadata
                
                response = await client.post(
                    f"{self.base_url}/collections/{self.collection}/search",
                    json=payload
                )
                
                if response.status_code == 200:
                    return response.json().get("results", [])
                return []
        except Exception as e:
            print(f"Error searching clauses: {e}")
            return []
    
    async def get_clause_by_id(self, clause_id: str) -> Optional[Dict]:
        """Retrieve a specific clause by ID"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/collections/{self.collection}/points/{clause_id}"
                )
                
                if response.status_code == 200:
                    return response.json()
                return None
        except Exception as e:
            print(f"Error retrieving clause: {e}")
            return None
    
    async def delete_clause(self, clause_id: str) -> bool:
        """Delete a clause from Endee"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.delete(
                    f"{self.base_url}/collections/{self.collection}/points/{clause_id}"
                )
                return response.status_code in [200, 204]
        except Exception as e:
            print(f"Error deleting clause: {e}")
            return False
    
    async def batch_insert_clauses(self, clauses: List[Dict]) -> bool:
        """Insert multiple clauses at once"""
        try:
            points = []
            for clause in clauses:
                embedding = self.generate_embedding(clause["text"])
                points.append({
                    "id": clause["id"],
                    "vector": embedding,
                    "metadata": clause.get("metadata", {})
                })
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/collections/{self.collection}/points/batch",
                    json={"points": points}
                )
                return response.status_code in [200, 201]
        except Exception as e:
            print(f"Error batch inserting clauses: {e}")
            return False
