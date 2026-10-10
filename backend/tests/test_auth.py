def test_auth_login_and_me(client):
    login_res = client.post("/api/v1/auth/login", json={"email": "aryan@aqua-xfoul.com"})
    assert login_res.status_code == 200
    data = login_res.json()
    assert "token" in data
    assert data["user"]["email"] == "aryan@aqua-xfoul.com"

    # Current user
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {data['token']}"})
    assert me_res.status_code == 200
    assert me_res.json()["name"] == "Aryan Kumar"

    # Logout
    logout_res = client.post("/api/v1/auth/logout")
    assert logout_res.status_code == 200
