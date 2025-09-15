#!/usr/bin/env python3
"""
Backend API Testing for Waitlist Endpoints
Tests the FastAPI backend waitlist functionality
"""

import requests
import json
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get base URL from frontend env
BASE_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://iceos-launch.preview.emergentagent.com')
API_BASE = f"{BASE_URL}/api"

def test_waitlist_post_valid_payloads():
    """Test POST /api/waitlist with valid payloads"""
    print("=" * 60)
    print("Testing POST /api/waitlist with valid payloads")
    print("=" * 60)
    
    # Test payload 1: Full payload with all fields
    payload1 = {
        "email": "alpha@test.com",
        "role": "Founder / Creator", 
        "usecase": "Encode ops systems"
    }
    
    print(f"Testing payload 1: {payload1}")
    response1 = requests.post(f"{API_BASE}/waitlist", json=payload1)
    print(f"Status Code: {response1.status_code}")
    print(f"Response: {response1.text}")
    
    if response1.status_code == 201:
        data1 = response1.json()
        required_fields = ['id', 'email', 'created_at']
        missing_fields = [field for field in required_fields if field not in data1]
        if missing_fields:
            print(f"❌ Missing required fields: {missing_fields}")
            return False
        else:
            print(f"✅ Payload 1 successful - ID: {data1['id']}, Email: {data1['email']}")
    else:
        print(f"❌ Payload 1 failed - Expected 201, got {response1.status_code}")
        return False
    
    # Test payload 2: Minimal payload with just email
    payload2 = {
        "email": "beta@test.com"
    }
    
    print(f"\nTesting payload 2: {payload2}")
    response2 = requests.post(f"{API_BASE}/waitlist", json=payload2)
    print(f"Status Code: {response2.status_code}")
    print(f"Response: {response2.text}")
    
    if response2.status_code == 201:
        data2 = response2.json()
        required_fields = ['id', 'email', 'created_at']
        missing_fields = [field for field in required_fields if field not in data2]
        if missing_fields:
            print(f"❌ Missing required fields: {missing_fields}")
            return False
        else:
            print(f"✅ Payload 2 successful - ID: {data2['id']}, Email: {data2['email']}")
    else:
        print(f"❌ Payload 2 failed - Expected 201, got {response2.status_code}")
        return False
    
    return True

def test_waitlist_post_invalid_email():
    """Test POST /api/waitlist with invalid email"""
    print("\n" + "=" * 60)
    print("Testing POST /api/waitlist with invalid email")
    print("=" * 60)
    
    invalid_payload = {
        "email": "not-an-email"
    }
    
    print(f"Testing invalid payload: {invalid_payload}")
    response = requests.post(f"{API_BASE}/waitlist", json=invalid_payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 422:
        print("✅ Invalid email correctly rejected with 422")
        return True
    else:
        print(f"❌ Expected 422 for invalid email, got {response.status_code}")
        return False

def test_waitlist_get():
    """Test GET /api/waitlist"""
    print("\n" + "=" * 60)
    print("Testing GET /api/waitlist")
    print("=" * 60)
    
    response = requests.get(f"{API_BASE}/waitlist")
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Response length: {len(data)}")
        
        if len(data) >= 2:
            print("✅ Array has at least 2 entries as expected")
            
            # Check if sorted by most recent first (created_at desc)
            if len(data) > 1:
                first_date = datetime.fromisoformat(data[0]['created_at'].replace('Z', '+00:00'))
                second_date = datetime.fromisoformat(data[1]['created_at'].replace('Z', '+00:00'))
                
                if first_date >= second_date:
                    print("✅ Results are sorted by most recent first")
                else:
                    print("❌ Results are NOT sorted by most recent first")
                    return False
            
            # Print first few entries for verification
            print("First few entries:")
            for i, entry in enumerate(data[:3]):
                print(f"  {i+1}. Email: {entry['email']}, Created: {entry['created_at']}")
            
            return True
        else:
            print(f"❌ Expected at least 2 entries, got {len(data)}")
            return False
    else:
        print(f"❌ GET request failed with status {response.status_code}")
        print(f"Response: {response.text}")
        return False

def test_cors_preflight():
    """Test CORS preflight OPTIONS request"""
    print("\n" + "=" * 60)
    print("Testing CORS preflight OPTIONS /api/waitlist")
    print("=" * 60)
    
    headers = {
        'Origin': 'https://example.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
    }
    
    response = requests.options(f"{API_BASE}/waitlist", headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    
    # Check if CORS headers are present
    cors_headers = [
        'access-control-allow-origin',
        'access-control-allow-methods',
        'access-control-allow-headers'
    ]
    
    missing_headers = []
    for header in cors_headers:
        if header not in response.headers:
            missing_headers.append(header)
    
    if response.status_code in [200, 204] and not missing_headers:
        print("✅ CORS preflight request successful")
        return True
    else:
        if missing_headers:
            print(f"❌ Missing CORS headers: {missing_headers}")
        if response.status_code not in [200, 204]:
            print(f"❌ Unexpected status code: {response.status_code}")
        return False

def main():
    """Run all tests"""
    print(f"Testing backend API at: {API_BASE}")
    print(f"Timestamp: {datetime.now().isoformat()}")
    
    test_results = []
    
    # Run all tests
    test_results.append(("POST valid payloads", test_waitlist_post_valid_payloads()))
    test_results.append(("POST invalid email", test_waitlist_post_invalid_email()))
    test_results.append(("GET waitlist", test_waitlist_get()))
    test_results.append(("CORS preflight", test_cors_preflight()))
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    passed = 0
    failed = 0
    
    for test_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
        else:
            failed += 1
    
    print(f"\nTotal: {passed + failed} tests")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    
    if failed == 0:
        print("\n🎉 All tests passed!")
        return True
    else:
        print(f"\n⚠️  {failed} test(s) failed")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)