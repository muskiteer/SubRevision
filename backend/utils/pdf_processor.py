import PyPDF2
from io import BytesIO
from typing import List, Dict

class PDFProcessor:
    """Utility class for PDF processing operations"""
    
    @staticmethod
    def extract_text_from_pdf(pdf_bytes: bytes) -> str:
        """
        Extract text from PDF bytes
        
        Args:
            pdf_bytes: PDF file content as bytes
            
        Returns:
            Extracted text as string
        """
        try:
            pdf_file = BytesIO(pdf_bytes)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            text = ""
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text()
            
            return text.strip()
        
        except Exception as e:
            raise Exception(f"Error extracting text from PDF: {str(e)}")
    
    @staticmethod
    def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
        """
        Split text into overlapping chunks for better context preservation
        
        Args:
            text: Input text to chunk
            chunk_size: Number of words per chunk
            overlap: Number of overlapping words between chunks
            
        Returns:
            List of text chunks
        """
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size - overlap):
            chunk = ' '.join(words[i:i + chunk_size])
            if chunk:
                chunks.append(chunk)
        
        return chunks
    
    @staticmethod
    def is_pdf_empty(text: str) -> bool:
        """
        Check if extracted text is empty or contains only whitespace
        
        Args:
            text: Extracted text
            
        Returns:
            True if empty, False otherwise
        """
        return not text or text.strip() == ""
    
    @staticmethod
    def get_pdf_metadata(pdf_bytes: bytes) -> Dict:
        """
        Extract metadata from PDF
        
        Args:
            pdf_bytes: PDF file content as bytes
            
        Returns:
            Dictionary containing metadata
        """
        try:
            pdf_file = BytesIO(pdf_bytes)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            return {
                "num_pages": len(pdf_reader.pages),
                "metadata": pdf_reader.metadata if pdf_reader.metadata else {}
            }
        except Exception as e:
            return {"error": str(e)}
