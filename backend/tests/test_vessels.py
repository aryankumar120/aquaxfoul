def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_list_vessels_pagination(client):
    response = client.get("/api/v1/vessels?page=1&limit=5")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert "total" in data
    assert data["total"] > 0
    assert len(data["data"]) <= 5
    assert data["page"] == 1


def test_search_vessels(client):
    response = client.get("/api/v1/vessels?search=Voyager")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert any("Voyager" in v["name"] for v in data["data"])


def test_filter_vessels_by_type(client):
    response = client.get("/api/v1/vessels?type=Container+Ship")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    for v in data["data"]:
        assert v["type"] == "Container Ship"


def test_get_vessel_by_id_and_imo(client):
    # Retrieve first vessel from list
    list_res = client.get("/api/v1/vessels?limit=1")
    vessel_id = list_res.json()["data"][0]["id"]
    imo = list_res.json()["data"][0]["imo"]

    # By ID
    res1 = client.get(f"/api/v1/vessels/{vessel_id}")
    assert res1.status_code == 200
    assert res1.json()["id"] == vessel_id

    # By IMO
    res2 = client.get(f"/api/v1/vessels/{imo}")
    assert res2.status_code == 200
    assert res2.json()["imo"] == imo


def test_get_vessel_not_found(client):
    response = client.get("/api/v1/vessels/99999999")
    assert response.status_code == 404


def test_create_and_delete_vessel(client):
    new_vessel = {
        "imo_number": 9991234,
        "name": "Test Ocean Star",
        "ship_type": "Tanker",
        "deadweight": 75000,
        "flag": "Panama",
        "length": 228.5,
        "breadth": 32.2,
        "status": "Active",
        "fouling_risk": "Low",
    }
    create_res = client.post("/api/v1/vessels", json=new_vessel)
    assert create_res.status_code == 201
    created_id = create_res.json()["id"]

    # Duplicate IMO conflict test
    dup_res = client.post("/api/v1/vessels", json=new_vessel)
    assert dup_res.status_code == 409

    # Delete
    del_res = client.delete(f"/api/v1/vessels/{created_id}")
    assert del_res.status_code == 204

    # Verify deleted
    get_res = client.get(f"/api/v1/vessels/{created_id}")
    assert get_res.status_code == 404
