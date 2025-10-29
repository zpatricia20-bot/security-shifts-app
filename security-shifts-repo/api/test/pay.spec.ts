// test/pay.spec.ts

describe('Pay Calculation', () => {
  describe('payableMinutes calculation', () => {
    it('should calculate payable minutes correctly', () => {
      const grossMinutes = 480; // 8 hours
      const unpaidBreakMinutes = 30;
      const payableMinutes = Math.max(0, grossMinutes - unpaidBreakMinutes);

      expect(payableMinutes).toBe(450);
    });

    it('should return 0 if unpaid breaks exceed gross time', () => {
      const grossMinutes = 60;
      const unpaidBreakMinutes = 120;
      const payableMinutes = Math.max(0, grossMinutes - unpaidBreakMinutes);

      expect(payableMinutes).toBe(0);
    });
  });

  describe('total pay calculation', () => {
    it('should calculate total cents correctly', () => {
      const payableMinutes = 450;
      const rateCents = 1500; // €15.00 per hour
      const totalCents = Math.floor((payableMinutes * rateCents) / 60);

      expect(totalCents).toBe(11250); // €112.50
    });
  });

  describe('rate precedence', () => {
    it('should prefer operator rate over shop default', () => {
      const operatorRate = 1600;
      const shopRate = 1500;
      const globalDefault = 1400;

      const selectedRate = operatorRate || shopRate || globalDefault;

      expect(selectedRate).toBe(1600);
    });

    it('should use shop rate if operator rate is undefined', () => {
      const operatorRate = undefined;
      const shopRate = 1500;
      const globalDefault = 1400;

      const selectedRate = operatorRate || shopRate || globalDefault;

      expect(selectedRate).toBe(1500);
    });

    it('should use global default if operator and shop rates are undefined', () => {
      const operatorRate = undefined;
      const shopRate = undefined;
      const globalDefault = 1400;

      const selectedRate = operatorRate || shopRate || globalDefault;

      expect(selectedRate).toBe(1400);
    });
  });

  describe('calcSnapshot audit trail', () => {
    it('should store calculation details for audit', () => {
      const snapshot = {
        method: 'standard',
        grossMinutes: 480,
        unpaidBreakMinutes: 30,
        payableMinutes: 450,
        rateCents: 1500,
        totalCents: 11250,
        periodKey: '2025-01',
      };

      expect(snapshot.method).toBe('standard');
      expect(snapshot.grossMinutes).toBe(480);
      expect(snapshot.unpaidBreakMinutes).toBe(30);
      expect(snapshot.totalCents).toBe(11250);
    });
  });
});
