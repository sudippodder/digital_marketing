import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal
from app.db.models import User, Client, MarketingProject

client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_admin_login_and_me():
    response = client.post("/api/v1/auth/login", json={
        "email": "admin@omniflow.ai",
        "password": "password123"
    })
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" == token_data["token_type"] or "bearer" == token_data["token_type"]
    token = token_data["access_token"]

    # Test /me
    me_resp = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == "admin@omniflow.ai"

def test_client_portal_login():
    response = client.post("/api/v1/auth/login", json={
        "email": "client@apexhealth.io",
        "password": "password123"
    })
    assert response.status_code == 200
    token_data = response.json()
    assert token_data["user"]["role"] == "client"

def test_clients_list_and_details():
    # Admin login
    admin_login = client.post("/api/v1/auth/login", json={
        "email": "admin@omniflow.ai",
        "password": "password123"
    }).json()
    token = admin_login["access_token"]

    resp = client.get("/api/v1/clients", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    clients = resp.json()
    assert len(clients) >= 2
    apex_client = next((c for c in clients if "Apex" in c["company_name"]), None)
    assert apex_client is not None
    assert apex_client["business_website"] == "https://apexhealth.io"

def test_marketing_validation_and_start():
    admin_login = client.post("/api/v1/auth/login", json={
        "email": "admin@omniflow.ai",
        "password": "password123"
    }).json()
    token = admin_login["access_token"]

    # Get client projects
    clients = client.get("/api/v1/clients", headers={"Authorization": f"Bearer {token}"}).json()
    client_id = clients[0]["id"]
    projects = client.get(f"/api/v1/clients/{client_id}/marketing-projects", headers={"Authorization": f"Bearer {token}"}).json()
    assert len(projects) > 0
    project_id = projects[0]["id"]

    # Validate
    val_resp = client.get(f"/api/v1/marketing-projects/{project_id}/validate", headers={"Authorization": f"Bearer {token}"})
    assert val_resp.status_code == 200
    assert val_resp.json()["is_valid"] is True

    # Start Marketing
    start_resp = client.post(f"/api/v1/marketing-projects/{project_id}/start", headers={"Authorization": f"Bearer {token}"})
    assert start_resp.status_code == 200
    assert start_resp.json()["success"] is True
    assert "execution_id" in start_resp.json()

def test_integration_connection_test():
    resp = client.post("/api/v1/integrations/test?provider_name=google_search_console")
    assert resp.status_code == 200
    assert resp.json()["success"] is True
