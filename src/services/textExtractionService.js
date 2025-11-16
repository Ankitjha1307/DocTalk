import Tesseract from 'tesseract.js';
let pdf;

const loadPdfParse = async () => {
  const module = await import('pdf-parse');
  pdf = module.default || module;
};


class TextExtractionService {
  
  // Extract text from any file type
  async extractTextFromFile(file) {
    try {
      const fileType = file.type;
      const fileName = file.name.toLowerCase();

      console.log(`Processing file: ${file.name}, type: ${fileType}`);

      if (fileType.startsWith('image/')) {
        return await this.extractTextFromImage(file);
      } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        return await this.extractTextFromPDF(file);
      } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
        return await this.extractTextFromTxt(file);
      } else {
        throw new Error('Unsupported file type. Please upload images, PDFs, or text files.');
      }
    } catch (error) {
      console.error('Text extraction error:', error);
      throw new Error(`Failed to extract text: ${error.message}`);
    }
  }

  // Extract text from images using OCR
  async extractTextFromImage(imageFile) {
    try {
      console.log('Starting OCR processing...');
      
      const result = await Tesseract.recognize(
        imageFile,
        'eng', // English language
        {
          logger: progress => {
            if (progress.status === 'recognizing text') {
              console.log(`OCR Progress: ${Math.round(progress.progress * 100)}%`);
            }
          }
        }
      );

      console.log('OCR completed successfully');
      return this.cleanExtractedText(result.data.text);
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Failed to read text from image. Please ensure the image is clear and contains visible text.');
    }
  }

  // Extract text from PDF
  async extractTextFromPDF(pdfFile) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async function(event) {
        try {
          await loadPdfParse();
          console.log("PDF parser loaded, starting text extraction....")
          const pdfBuffer = new Uint8Array(event.target.result);
          const data = await pdf(pdfBuffer);
          console.log('PDF text extraction completed');
          resolve(data.text);
        } catch (error) {
          console.error('PDF parsing error:', error);
          reject(new Error('Failed to read PDF. The file may be corrupted or scanned as image.'));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsArrayBuffer(pdfFile);
    });
  }

  // Extract text from plain text file
  async extractTextFromTxt(txtFile) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      
      reader.onerror = () => reject(new Error('Failed to read text file'));
      reader.readAsText(txtFile);
    });
  }

  // Clean and preprocess extracted text
  cleanExtractedText(text) {
    if (!text || text.trim().length === 0) {
      throw new Error('No text could be extracted from the document. Please try a clearer image or different file.');
    }

    // Remove excessive whitespace and clean up text
    let cleanedText = text
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Reduce multiple newlines
      .replace(/[^\S\n]+/g, ' ') // Replace multiple spaces with single space
      .trim();

    // Check if we have meaningful text
    const wordCount = cleanedText.split(/\s+/).length;
    if (wordCount < 5) {
      throw new Error('Very little text was extracted. The document may be unclear or contain mostly non-text elements.');
    }

    console.log(`Extracted ${wordCount} words from document`);
    return cleanedText;
  }

  // Validate if file is supported
  validateFile(file) {
    const supportedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/bmp',
      'image/gif',
      'application/pdf',
      'text/plain'
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!supportedTypes.includes(file.type) && !file.name.match(/\.(pdf|txt)$/i)) {
      throw new Error('Unsupported file type. Please upload images (JPEG, PNG, etc.), PDFs, or text files.');
    }

    if (file.size > maxSize) {
      throw new Error('File size too large. Please upload files smaller than 10MB.');
    }

    if (file.size === 0) {
      throw new Error('File appears to be empty.');
    }

    return true;
  }
}

export default new TextExtractionService();