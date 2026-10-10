def test_vessel_projections_scenarios(client):
    list_res = client.get("/api/v1/vessels?limit=1")
    vessel_id = list_res.json()["data"][0]["id"]

    response = client.get(f"/api/v1/projections/{vessel_id}")
    assert response.status_code == 200
    data = response.json()

    assert "scenarios" in data
    assert "noCleaning" in data["scenarios"]
    assert "cleanNow" in data["scenarios"]
    assert "cleanLater" in data["scenarios"]

    # Check scenario details
    clean_now = data["scenarios"]["cleanNow"]
    assert clean_now["scenarioId"] == "clean-now"
    assert clean_now["efficiencyRecoveryPct"] > 90
    assert len(clean_now["series"]) == 6

    no_cleaning = data["scenarios"]["noCleaning"]
    assert no_cleaning["scenarioId"] == "no-cleaning"
    assert no_cleaning["efficiencyRecoveryPct"] == 0.0
