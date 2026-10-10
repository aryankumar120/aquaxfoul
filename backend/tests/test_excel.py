import io
import pandas as pd


def test_excel_upload_and_import(client):
    # Create in-memory Excel file
    df = pd.DataFrame([
        {
            "IMO Number": 9988771,
            "Name of Ship": "Aqua Explorer",
            "Ship Type": "Container Ship",
            "Deadweight": 85000,
            "Flag": "Singapore",
            "Technical Manager": "Aqua Maritime",
            "Length": 300.0,
            "Breadth": 42.0,
        },
        {
            "IMO Number": 9988772,
            "Name of Ship": "Aqua Guardian",
            "Ship Type": "Bulk Carrier",
            "Deadweight": 65000,
            "Flag": "Panama",
            "Technical Manager": "Oceanic Fleet",
            "Length": 225.0,
            "Breadth": 32.2,
        },
        # Duplicate row
        {
            "IMO Number": 9988771,
            "Name of Ship": "Aqua Explorer Duplicate",
            "Ship Type": "Container Ship",
            "Deadweight": 85000,
            "Flag": "Singapore",
        },
        # Invalid row (missing IMO)
        {
            "IMO Number": None,
            "Name of Ship": "Missing IMO Ship",
            "Ship Type": "Tanker",
        },
    ])

    excel_buffer = io.BytesIO()
    df.to_excel(excel_buffer, index=False, engine="openpyxl")
    excel_buffer.seek(0)

    files = {
        "file": ("test_import.xlsx", excel_buffer, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    }

    response = client.post("/api/v1/vessels/import", files=files)
    assert response.status_code == 200
    summary = response.json()

    assert summary["new_vessels"] == 2
    assert summary["duplicates_detected"] == 1
    assert summary["invalid_records"] == 1
    assert summary["status"] == "Import completed"

    # Verify newly imported vessel can be retrieved via API
    vessel_res = client.get("/api/v1/vessels/9988771")
    assert vessel_res.status_code == 200
    assert vessel_res.json()["name"] == "Aqua Explorer"
