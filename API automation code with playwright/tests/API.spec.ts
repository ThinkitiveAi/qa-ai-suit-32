import { test, expect } from '@playwright/test';

// Test configuration and constants
const BASE_URL = 'https://stage-api.ecarehealth.com';
const TENANT_ID = 'stage_aithinkitive';
const LOGIN_CREDENTIALS = {
  username: 'rose.gomez@jourrapide.com',
  password: 'Pass@123',
  xTENANTID: TENANT_ID
};

// Common headers for API requests
const commonHeaders = {
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Connection': 'keep-alive',
  'Content-Type': 'application/json',
  'Origin': 'https://stage_aithinkitive.uat.provider.ecarehealth.com',
  'Referer': 'https://stage_aithinkitive.uat.provider.ecarehealth.com/',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-site',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
  'X-TENANT-ID': TENANT_ID,
  'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"'
};

// Types for API responses
interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  // Add other fields as needed
}

interface AppointmentBookingRequest {
  mode: string;
  patientId: string;
  customForms: null;
  visit_type: string;
  type: string;
  paymentType: string;
  providerId: string;
  startTime: string;
  endTime: string;
  insurance_type: string;
  note: string;
  authorization: string;
  forms: any[];
  chiefComplaint: string;
  isRecurring: boolean;
  recurringFrequency: string;
  reminder_set: boolean;
  endType: string;
  endDate: string;
  endAfter: number;
  customFrequency: number;
  customFrequencyUnit: string;
  selectedWeekdays: any[];
  reminder_before_number: number;
  timezone: string;
  duration: number;
  xTENANTID: string;
}

test.describe('Healthcare API Tests', () => {
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    // Login and get authentication token
    const loginResponse = await request.post(`${BASE_URL}/api/master/login`, {
      headers: commonHeaders,
      data: LOGIN_CREDENTIALS
    });

    expect(loginResponse.ok()).toBeTruthy();
    
    const loginData: LoginResponse = await loginResponse.json();
    authToken = loginData.access_token;
    
    expect(authToken).toBeTruthy();
    console.log('Authentication successful');
  });

  test('should successfully login', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/master/login`, {
      headers: commonHeaders,
      data: LOGIN_CREDENTIALS
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const responseData = await response.json();
    expect(responseData).toHaveProperty('access_token');
    expect(responseData.access_token).toBeTruthy();
  });

  test('should fail login with invalid credentials', async ({ request }) => {
    const invalidCredentials = {
      ...LOGIN_CREDENTIALS,
      password: 'WrongPassword123'
    };

    const response = await request.post(`${BASE_URL}/api/master/login`, {
      headers: commonHeaders,
      data: invalidCredentials
    });

    expect(response.ok()).toBeFalsy();
    expect([401, 403]).toContain(response.status());
  });

  test('should book an appointment successfully', async ({ request }) => {
    const appointmentData: AppointmentBookingRequest = {
      mode: 'VIRTUAL',
      patientId: '380f127e-058c-4c18-9f9e-cfc1a7c36261',
      customForms: null,
      visit_type: '',
      type: 'NEW',
      paymentType: 'CASH',
      providerId: '6034e563-9768-4699-9c88-5ae6bc2e9c3f',
      startTime: '2025-07-30T06:30:00Z',
      endTime: '2025-07-30T07:00:00Z',
      insurance_type: '',
      note: '',
      authorization: '',
      forms: [],
      chiefComplaint: 'First visit',
      isRecurring: false,
      recurringFrequency: 'daily',
      reminder_set: false,
      endType: 'never',
      endDate: '2025-07-25T06:03:33.823Z',
      endAfter: 5,
      customFrequency: 1,
      customFrequencyUnit: 'days',
      selectedWeekdays: [],
      reminder_before_number: 1,
      timezone: 'IST',
      duration: 30,
      xTENANTID: TENANT_ID
    };

    const response = await request.post(`${BASE_URL}/api/master/appointment`, {
      headers: {
        ...commonHeaders,
        'Authorization': `Bearer ${authToken}`
      },
      data: appointmentData
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const responseData = await response.json();
    console.log('Appointment booked successfully:', responseData);
  });

  test('should fail to book appointment without authentication', async ({ request }) => {
    const appointmentData: AppointmentBookingRequest = {
      mode: 'VIRTUAL',
      patientId: '380f127e-058c-4c18-9f9e-cfc1a7c36261',
      customForms: null,
      visit_type: '',
      type: 'NEW',
      paymentType: 'CASH',
      providerId: '6034e563-9768-4699-9c88-5ae6bc2e9c3f',
      startTime: '2025-07-30T06:30:00Z',
      endTime: '2025-07-30T07:00:00Z',
      insurance_type: '',
      note: '',
      authorization: '',
      forms: [],
      chiefComplaint: 'First visit',
      isRecurring: false,
      recurringFrequency: 'daily',
      reminder_set: false,
      endType: 'never',
      endDate: '2025-07-25T06:03:33.823Z',
      endAfter: 5,
      customFrequency: 1,
      customFrequencyUnit: 'days',
      selectedWeekdays: [],
      reminder_before_number: 1,
      timezone: 'IST',
      duration: 30,
      xTENANTID: TENANT_ID
    };

    const response = await request.post(`${BASE_URL}/api/master/appointment`, {
      headers: commonHeaders, // No Authorization header
      data: appointmentData
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(401);
  });

  test('should validate appointment booking with invalid patient ID', async ({ request }) => {
    const appointmentData: AppointmentBookingRequest = {
      mode: 'VIRTUAL',
      patientId: 'invalid-patient-id',
      customForms: null,
      visit_type: '',
      type: 'NEW',
      paymentType: 'CASH',
      providerId: '6034e563-9768-4699-9c88-5ae6bc2e9c3f',
      startTime: '2025-07-30T06:30:00Z',
      endTime: '2025-07-30T07:00:00Z',
      insurance_type: '',
      note: '',
      authorization: '',
      forms: [],
      chiefComplaint: 'First visit',
      isRecurring: false,
      recurringFrequency: 'daily',
      reminder_set: false,
      endType: 'never',
      endDate: '2025-07-25T06:03:33.823Z',
      endAfter: 5,
      customFrequency: 1,
      customFrequencyUnit: 'days',
      selectedWeekdays: [],
      reminder_before_number: 1,
      timezone: 'IST',
      duration: 30,
      xTENANTID: TENANT_ID
    };

    const response = await request.post(`${BASE_URL}/api/master/appointment`, {
      headers: {
        ...commonHeaders,
        'Authorization': `Bearer ${authToken}`
      },
      data: appointmentData
    });

    expect(response.ok()).toBeFalsy();
    expect([400, 404]).toContain(response.status());
  });

  test('should validate appointment booking with past date', async ({ request }) => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const pastStartTime = pastDate.toISOString();
    
    const pastEndTime = new Date(pastDate);
    pastEndTime.setMinutes(pastEndTime.getMinutes() + 30);

    const appointmentData: AppointmentBookingRequest = {
      mode: 'VIRTUAL',
      patientId: '380f127e-058c-4c18-9f9e-cfc1a7c36261',
      customForms: null,
      visit_type: '',
      type: 'NEW',
      paymentType: 'CASH',
      providerId: '6034e563-9768-4699-9c88-5ae6bc2e9c3f',
      startTime: pastStartTime,
      endTime: pastEndTime.toISOString(),
      insurance_type: '',
      note: '',
      authorization: '',
      forms: [],
      chiefComplaint: 'First visit',
      isRecurring: false,
      recurringFrequency: 'daily',
      reminder_set: false,
      endType: 'never',
      endDate: '2025-07-25T06:03:33.823Z',
      endAfter: 5,
      customFrequency: 1,
      customFrequencyUnit: 'days',
      selectedWeekdays: [],
      reminder_before_number: 1,
      timezone: 'IST',
      duration: 30,
      xTENANTID: TENANT_ID
    };

    const response = await request.post(`${BASE_URL}/api/master/appointment`, {
      headers: {
        ...commonHeaders,
        'Authorization': `Bearer ${authToken}`
      },
      data: appointmentData
    });

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(400);
  });

  // Additional test for GET endpoints (when URLs are provided)
  test.skip('should get provider information', async ({ request }) => {
    // This test is skipped because the GET endpoint URL is not provided in the collection
    // Uncomment and update the URL when available
    
    const response = await request.get(`${BASE_URL}/api/master/provider`, {
      headers: {
        ...commonHeaders,
        'Authorization': `Bearer ${authToken}`
      }
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

  test.skip('should get patient information', async ({ request }) => {
    // This test is skipped because the GET endpoint URL is not provided in the collection
    // Uncomment and update the URL when available
    
    const response = await request.get(`${BASE_URL}/api/master/patient`, {
      headers: {
        ...commonHeaders,
        'Authorization': `Bearer ${authToken}`
      }
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

  test.skip('should get availability information', async ({ request }) => {
    // This test is skipped because the GET endpoint URL is not provided in the collection
    // Uncomment and update the URL when available
    
    const response = await request.get(`${BASE_URL}/api/master/availability`, {
      headers: {
        ...commonHeaders,
        'Authorization': `Bearer ${authToken}`
      }
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });
});

// Configuration test to run with different environments
test.describe('Environment Configuration Tests', () => {
  test('should handle different tenant configurations', async ({ request }) => {
    const testCredentials = {
      username: 'rose.gomez@jourrapide.com',
      password: 'Pass@123',
      xTENANTID: 'different_tenant'
    };

    const response = await request.post(`${BASE_URL}/api/master/login`, {
      headers: {
        ...commonHeaders,
        'X-TENANT-ID': 'different_tenant'
      },
      data: testCredentials
    });

    // This might fail if the tenant doesn't exist, which is expected
    if (response.status() === 404 || response.status() === 400) {
      console.log('Tenant validation working correctly');
    } else {
      expect(response.ok()).toBeTruthy();
    }
  });
});