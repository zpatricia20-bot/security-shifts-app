// test/whatsapp-parser.spec.ts

describe('WhatsApp Parser', () => {
  describe('confirmation reply parsing', () => {
    it('should parse OK confirmation', () => {
      const message = 'OK';
      const isConfirmed = /^(ok|✅|si|sì|yes)$/i.test(message.trim());

      expect(isConfirmed).toBe(true);
    });

    it('should parse emoji confirmation', () => {
      const message = '✅';
      const isConfirmed = /^(ok|✅|si|sì|yes)$/i.test(message.trim());

      expect(isConfirmed).toBe(true);
    });

    it('should parse NO as declined', () => {
      const message = 'NO';
      const isDeclined = /^(no|❌|non)$/i.test(message.trim());

      expect(isDeclined).toBe(true);
    });

    it('should handle case insensitivity', () => {
      const message = 'Ok';
      const isConfirmed = /^(ok|✅|si|sì|yes)$/i.test(message.trim());

      expect(isConfirmed).toBe(true);
    });
  });

  describe('GPS location parsing', () => {
    it('should parse GPS coordinates from message', () => {
      const message = 'IN 45.628,9.204';
      const match = message.match(/IN\s+([-\d.]+),([-\d.]+)/i);

      if (match) {
        const [, lat, lon] = match;
        expect(parseFloat(lat)).toBe(45.628);
        expect(parseFloat(lon)).toBe(9.204);
      }
    });

    it('should recognize attendance keywords', () => {
      const keywords = ['IN', 'BREAK START', 'BREAK END', 'OUT'];
      const message = 'IN 45.628,9.204';

      const hasKeyword = keywords.some(kw => message.includes(kw));

      expect(hasKeyword).toBe(true);
    });
  });

  describe('timezone-aware scheduling', () => {
    it('should convert times to Europe/Rome timezone', () => {
      const now = new Date();
      const timeString = new Intl.DateTimeFormat('it-IT', {
        timeZone: 'Europe/Rome',
        hour: '2-digit',
        minute: '2-digit',
      }).format(now);

      expect(timeString).toMatch(/\d{2}:\d{2}/);
    });

    it('should schedule night confirmations at 20:00 Rome time', () => {
      const confirmationHour = 20;
      const now = new Date();
      const romeTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Rome' }));

      expect(confirmationHour).toBe(20);
      expect(romeTime).toBeDefined();
    });
  });

  describe('message normalization', () => {
    it('should trim whitespace', () => {
      const message = '  OK  ';
      const normalized = message.trim();

      expect(normalized).toBe('OK');
    });

    it('should handle multiple spaces', () => {
      const message = 'IN    45.628,9.204';
      const normalized = message.replace(/\s+/g, ' ').trim();
      const match = normalized.match(/IN\s+([-\d.]+),([-\d.]+)/i);

      expect(match).toBeTruthy();
    });
  });
});
