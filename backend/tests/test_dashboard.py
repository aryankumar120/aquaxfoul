def test_dashboard_summary(client):
    response = client.get("/api/v1/dashboard/summary")
    assert response.status_code == 200
    data = response.json()

    assert "kpis" in data
    assert "totalVessels" in data["kpis"]
    assert "activeVessels" in data["kpis"]
    assert "requiringAttention" in data["kpis"]
    assert "cleaningDue" in data["kpis"]
    assert "estimatedCo2Savings" in data["kpis"]

    assert data["kpis"]["totalVessels"]["value"] >= 10

    assert "vesselDistribution" in data
    assert len(data["vesselDistribution"]) > 0

    assert "riskDistribution" in data
    assert len(data["riskDistribution"]) == 4

    assert "fuelConsumptionTrend" in data
    assert len(data["fuelConsumptionTrend"]) > 0

    assert "recentVessels" in data
    assert "recentAlerts" in data
