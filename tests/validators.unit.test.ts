import { describe, it, expect } from 'vitest';
import { signupSchema, loginSchema } from '../src/validators/auth.js';
import { createExperienceSchema, queryExperiencesSchema } from '../src/validators/experiences.js';
import { createBookingSchema } from '../src/validators/bookings.js';

describe('auth validators', () => {
  it('accepts valid signup payload', () => {
    const result = signupSchema.parse({
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
    });

    expect(result.email).toBe('user@example.com');
    expect(result.role).toBe('user');
  });

  it('rejects signup payload with invalid email', () => {
    expect(() =>
      signupSchema.parse({
        email: 'invalid-email',
        password: 'password123',
        role: 'host',
      })
    ).toThrow();
  });

  it('accepts valid login payload', () => {
    const result = loginSchema.parse({
      email: 'user@example.com',
      password: 'password123',
    });

    expect(result.email).toBe('user@example.com');
  });
});

describe('experience validators', () => {
  it('accepts valid create experience payload', () => {
    const result = createExperienceSchema.parse({
      title: 'Sunset Kayaking',
      description: 'Beginner friendly',
      location: 'Goa',
      price: 1200,
      startTime: '2026-05-01T10:00:00Z',
    });

    expect(result.title).toBe('Sunset Kayaking');
    expect(result.price).toBe(1200);
  });

  it('rejects create experience payload with non-positive price', () => {
    expect(() =>
      createExperienceSchema.parse({
        title: 'Sunset Kayaking',
        price: 0,
        startTime: '2026-05-01T10:00:00Z',
      })
    ).toThrow();
  });

  it('applies defaults for query payload', () => {
    const result = queryExperiencesSchema.parse({});

    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.sort).toBe('asc');
  });
});

describe('booking validator', () => {
  it('accepts positive integer seats', () => {
    const result = createBookingSchema.parse({ seats: 2 });
    expect(result.seats).toBe(2);
  });

  it('rejects non-integer or non-positive seats', () => {
    expect(() => createBookingSchema.parse({ seats: 1.5 })).toThrow();
    expect(() => createBookingSchema.parse({ seats: 0 })).toThrow();
  });
});
