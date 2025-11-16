class PrivacyService {
  
  sanitizeMedicalText(medicalText) {
    if (!medicalText) return '';
    
    let sanitized = medicalText;
    
    sanitized = this.removeNames(sanitized);
    sanitized = this.removeIDs(sanitized);
    sanitized = this.removeDates(sanitized);
    sanitized = this.removeAddresses(sanitized);
    sanitized = this.removeContactInfo(sanitized);
    
    return sanitized.trim();
  }

  removeNames(text) {
    return text
      .replace(/(Patient|Name|PATIENT|NAME)\s*:?\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+/gi, 'Patient: [REDACTED]')
      .replace(/(Dr\.|Doctor)\s*:?\s*[A-Za-z]+(?:\s+[A-Za-z]+)*/gi, 'Doctor: [REDACTED]');
  }

  removeIDs(text) {
    return text
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[ID_REDACTED]')
      .replace(/\bMRN\s*[:#]?\s*\d+\b/gi, 'MRN: [REDACTED]')
      .replace(/\bID\s*[:#]?\s*\w+\b/gi, 'ID: [REDACTED]')
      .replace(/\b\d{10,}\b/g, '[ID_REDACTED]');
  }

  removeDates(text) {
    return text.replace(/\b(DOB|Birth|Born)[:\s]*\d{1,2}[/-]\d{1,2}[/-]\d{4}\b/gi, '$1: [DATE_REDACTED]');
  }

  removeAddresses(text) {
    return text.replace(/\b\d+\s+[A-Z][a-z]+\s+(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln)/gi, '[ADDRESS_REDACTED]');
  }

  removeContactInfo(text) {
    return text
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE_REDACTED]')
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]');
  }

  hasSensitiveInfo(text) {
    const sensitivePatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/,
      /Patient:\s*[A-Z][a-z]+\s+[A-Z][a-z]+/i,
      /\bMRN\s*[:#]?\s*\d+\b/i,
      /\bDOB\s*[:]?\s*\d{1,2}[/-]\d{1,2}[/-]\d{4}\b/i,
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/,
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
    ];
    
    return sensitivePatterns.some(pattern => pattern.test(text));
  }
}

export default new PrivacyService();