#!/usr/bin/env python3
"""Generate refined download assets in r2-uploads using only stdlib."""

from __future__ import annotations

import datetime as dt
import os
import textwrap
import zipfile
from typing import List, Dict, Any

BASE_DIR = "/Users/tamem.jalallar/Library/CloudStorage/OneDrive-Ogilvy/Documents/TamemJ/TamemJ"
OUT_DIR = os.path.join(BASE_DIR, "r2-uploads")


def ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)


def wrap_lines(text: str, width: int = 88) -> List[str]:
    return textwrap.wrap(text, width=width, replace_whitespace=False)


def pdf_escape(text: str) -> str:
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def col_letter(n: int) -> str:
    # 1-indexed
    result = ""
    while n > 0:
        n, rem = divmod(n - 1, 26)
        result = chr(65 + rem) + result
    return result


# -------------------------
# PDF generator
# -------------------------

def write_simple_pdf(path: str, title: str, body_lines: List[str]) -> None:
    today = dt.date.today().isoformat()
    header_line = "Logo Placeholder | Organization Name"
    footer_line = f"Organization Name | Version 1.0 | Updated {today}"

    lines = [title, "", "Summary", "This checklist is designed for enterprise IT teams.", ""] + body_lines

    final_lines: List[str] = []
    for line in lines:
        if not line:
            final_lines.append("")
            continue
        final_lines.extend(wrap_lines(line, 88))

    content_lines: List[str] = []
    content_lines.append("BT")
    content_lines.append("/F1 10 Tf")
    content_lines.append("50 780 Td")
    content_lines.append(f"({pdf_escape(header_line)}) Tj")
    content_lines.append("ET")

    content_lines.append("BT")
    content_lines.append("/F1 18 Tf")
    content_lines.append("50 748 Td")
    content_lines.append(f"({pdf_escape(final_lines[0])}) Tj")
    content_lines.append("/F1 12 Tf")
    content_lines.append("0 -26 Td")

    for line in final_lines[1:]:
        content_lines.append(f"({pdf_escape(line)}) Tj")
        content_lines.append("0 -16 Td")
    content_lines.append("ET")

    content_lines.append("BT")
    content_lines.append("/F1 9 Tf")
    content_lines.append("50 40 Td")
    content_lines.append(f"({pdf_escape(footer_line)}) Tj")
    content_lines.append("ET")

    content_stream = "\n".join(content_lines).encode("utf-8")

    objects: List[bytes] = []
    objects.append(b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")
    objects.append(b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n")
    objects.append(
        b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
        b"/Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n"
    )
    objects.append(
        b"4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n"
    )
    objects.append(
        b"5 0 obj\n<< /Length "
        + str(len(content_stream)).encode("utf-8")
        + b" >>\nstream\n"
        + content_stream
        + b"\nendstream\nendobj\n"
    )

    xref_offsets = []
    pdf = b"%PDF-1.4\n"
    for obj in objects:
        xref_offsets.append(len(pdf))
        pdf += obj

    xref_start = len(pdf)
    pdf += b"xref\n0 " + str(len(objects) + 1).encode("utf-8") + b"\n"
    pdf += b"0000000000 65535 f \n"
    for offset in xref_offsets:
        pdf += f"{offset:010d} 00000 n \n".encode("utf-8")
    pdf += (
        b"trailer\n<< /Size "
        + str(len(objects) + 1).encode("utf-8")
        + b" /Root 1 0 R >>\nstartxref\n"
        + str(xref_start).encode("utf-8")
        + b"\n%%EOF"
    )

    with open(path, "wb") as f:
        f.write(pdf)


# -------------------------
# XLSX generator (styled)
# -------------------------

def _xlsx_cell(ref: str, value: str, style: int = 0) -> str:
    safe = value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    return (
        f'<c r="{ref}" t="inlineStr" s="{style}">'
        f"<is><t>{safe}</t></is></c>"
    )


def _xlsx_row(row_index: int, values: List[str], style: int = 0) -> str:
    cells = []
    for col_index, value in enumerate(values, start=1):
        col_letter = col_letter_for_index(col_index)
        ref = f"{col_letter}{row_index}"
        cells.append(_xlsx_cell(ref, value, style))
    return f"<row r=\"{row_index}\">" + "".join(cells) + "</row>"


def col_letter_for_index(index: int) -> str:
    return col_letter(index)


def write_simple_xlsx(
    path: str,
    title: str,
    headers: List[str],
    sample: List[str],
    instructions: List[str],
    column_widths: List[int] | None = None,
) -> None:
    ensure_dir(os.path.dirname(path))
    column_widths = column_widths or [24 for _ in headers]
    today = dt.date.today().isoformat()

    last_col = col_letter_for_index(len(headers))

    # Sheet1: Template
    sheet1_rows: List[str] = []
    sheet1_rows.append(_xlsx_row(1, [title], style=3))
    sheet1_rows.append(_xlsx_row(2, ["Logo Placeholder"], style=2))
    sheet1_rows.append(_xlsx_row(3, ["Organization Name IT Templates"], style=2))
    sheet1_rows.append(
        _xlsx_row(4, [f"Version 1.0 | Updated {today} | Owner: IT Operations"], style=4)
    )
    sheet1_rows.append(_xlsx_row(5, [""], style=0))
    sheet1_rows.append(_xlsx_row(6, headers, style=1))
    sheet1_rows.append(_xlsx_row(7, sample, style=0))

    cols_xml = "".join(
        f"<col min=\"{i}\" max=\"{i}\" width=\"{w}\" customWidth=\"1\"/>"
        for i, w in enumerate(column_widths, start=1)
    )

    merge_xml = (
        f"<mergeCells count=\"4\">"
        f"<mergeCell ref=\"A1:{last_col}1\"/>"
        f"<mergeCell ref=\"A2:{last_col}2\"/>"
        f"<mergeCell ref=\"A3:{last_col}3\"/>"
        f"<mergeCell ref=\"A4:{last_col}4\"/>"
        f"</mergeCells>"
    )

    sheet1_xml = (
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
        "<worksheet xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\">"
        "<sheetViews><sheetView workbookViewId=\"0\"><pane ySplit=\"6\" topLeftCell=\"A7\" activePane=\"bottomLeft\" state=\"frozen\"/></sheetView></sheetViews>"
        f"<cols>{cols_xml}</cols>"
        "<sheetData>"
        + "".join(sheet1_rows)
        + "</sheetData>"
        + merge_xml
        + "</worksheet>"
    )

    # Sheet2: Instructions
    instructions_rows: List[str] = []
    instructions_rows.append(_xlsx_row(1, ["Instructions"], style=3))
    instructions_rows.append(_xlsx_row(2, [""], style=0))
    row_idx = 3
    for line in instructions:
        instructions_rows.append(_xlsx_row(row_idx, [line], style=0))
        row_idx += 1

    sheet2_xml = (
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
        "<worksheet xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\">"
        "<cols><col min=\"1\" max=\"1\" width=\"120\" customWidth=\"1\"/></cols>"
        "<sheetData>"
        + "".join(instructions_rows)
        + "</sheetData>"
        "</worksheet>"
    )

    workbook_xml = (
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
        "<workbook xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" "
        "xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\">"
        "<sheets>"
        "<sheet name=\"Template\" sheetId=\"1\" r:id=\"rId1\"/>"
        "<sheet name=\"Instructions\" sheetId=\"2\" r:id=\"rId2\"/>"
        "</sheets>"
        "</workbook>"
    )

    workbook_rels = (
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
        "<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">"
        "<Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet\" "
        "Target=\"worksheets/sheet1.xml\"/>"
        "<Relationship Id=\"rId2\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet\" "
        "Target=\"worksheets/sheet2.xml\"/>"
        "</Relationships>"
    )

    root_rels = (
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
        "<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">"
        "<Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument\" "
        "Target=\"xl/workbook.xml\"/>"
        "</Relationships>"
    )

    content_types = (
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
        "<Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\">"
        "<Default Extension=\"rels\" ContentType=\"application/vnd.openxmlformats-package.relationships+xml\"/>"
        "<Default Extension=\"xml\" ContentType=\"application/xml\"/>"
        "<Override PartName=\"/xl/workbook.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml\"/>"
        "<Override PartName=\"/xl/worksheets/sheet1.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml\"/>"
        "<Override PartName=\"/xl/worksheets/sheet2.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml\"/>"
        "<Override PartName=\"/xl/styles.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml\"/>"
        "</Types>"
    )

    styles_xml = (
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
        "<styleSheet xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\">"
        "<fonts count=\"4\">"
        "<font><sz val=\"11\"/><color theme=\"1\"/><name val=\"Calibri\"/><family val=\"2\"/></font>"
        "<font><b/><sz val=\"11\"/><color theme=\"1\"/><name val=\"Calibri\"/><family val=\"2\"/></font>"
        "<font><i/><sz val=\"11\"/><color theme=\"1\"/><name val=\"Calibri\"/><family val=\"2\"/></font>"
        "<font><b/><sz val=\"14\"/><color theme=\"1\"/><name val=\"Calibri\"/><family val=\"2\"/></font>"
        "</fonts>"
        "<fills count=\"2\">"
        "<fill><patternFill patternType=\"none\"/></fill>"
        "<fill><patternFill patternType=\"solid\"><fgColor rgb=\"FFE9EEF5\"/><bgColor indexed=\"64\"/></patternFill></fill>"
        "</fills>"
        "<borders count=\"1\"><border><left/><right/><top/><bottom/><diagonal/></border></borders>"
        "<cellStyleXfs count=\"1\"><xf numFmtId=\"0\" fontId=\"0\" fillId=\"0\" borderId=\"0\"/></cellStyleXfs>"
        "<cellXfs count=\"5\">"
        "<xf numFmtId=\"0\" fontId=\"0\" fillId=\"0\" borderId=\"0\" xfId=\"0\"/>"
        "<xf numFmtId=\"0\" fontId=\"1\" fillId=\"1\" borderId=\"0\" xfId=\"0\" applyFont=\"1\" applyFill=\"1\" applyAlignment=\"1\"><alignment horizontal=\"center\" vertical=\"center\" wrapText=\"1\"/></xf>"
        "<xf numFmtId=\"0\" fontId=\"2\" fillId=\"0\" borderId=\"0\" xfId=\"0\" applyFont=\"1\" applyAlignment=\"1\"><alignment horizontal=\"center\" vertical=\"center\"/></xf>"
        "<xf numFmtId=\"0\" fontId=\"3\" fillId=\"0\" borderId=\"0\" xfId=\"0\" applyFont=\"1\" applyAlignment=\"1\"><alignment horizontal=\"center\" vertical=\"center\"/></xf>"
        "<xf numFmtId=\"0\" fontId=\"0\" fillId=\"0\" borderId=\"0\" xfId=\"0\" applyAlignment=\"1\"><alignment horizontal=\"center\" vertical=\"center\"/></xf>"
        "</cellXfs>"
        "<cellStyles count=\"1\"><cellStyle name=\"Normal\" xfId=\"0\" builtinId=\"0\"/></cellStyles>"
        "</styleSheet>"
    )

    with zipfile.ZipFile(path, "w", compression=zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", content_types)
        z.writestr("_rels/.rels", root_rels)
        z.writestr("xl/workbook.xml", workbook_xml)
        z.writestr("xl/_rels/workbook.xml.rels", workbook_rels)
        z.writestr("xl/worksheets/sheet1.xml", sheet1_xml)
        z.writestr("xl/worksheets/sheet2.xml", sheet2_xml)
        z.writestr("xl/styles.xml", styles_xml)


# -------------------------
# DOCX generator (enhanced)
# -------------------------

def _docx_paragraph(text: str, style: str | None = None) -> str:
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    if style:
        return (
            "<w:p>"
            f"<w:pPr><w:pStyle w:val=\"{style}\"/></w:pPr>"
            f"<w:r><w:t>{text}</w:t></w:r>"
            "</w:p>"
        )
    return f"<w:p><w:r><w:t>{text}</w:t></w:r></w:p>"


def _docx_table(rows: List[List[str]]) -> str:
    border = (
        "<w:tblBorders>"
        "<w:top w:val=\"single\" w:sz=\"8\" w:space=\"0\" w:color=\"D0D7DE\"/>"
        "<w:left w:val=\"single\" w:sz=\"8\" w:space=\"0\" w:color=\"D0D7DE\"/>"
        "<w:bottom w:val=\"single\" w:sz=\"8\" w:space=\"0\" w:color=\"D0D7DE\"/>"
        "<w:right w:val=\"single\" w:sz=\"8\" w:space=\"0\" w:color=\"D0D7DE\"/>"
        "<w:insideH w:val=\"single\" w:sz=\"8\" w:space=\"0\" w:color=\"D0D7DE\"/>"
        "<w:insideV w:val=\"single\" w:sz=\"8\" w:space=\"0\" w:color=\"D0D7DE\"/>"
        "</w:tblBorders>"
    )
    tbl = ["<w:tbl>", f"<w:tblPr>{border}</w:tblPr>"]
    for row in rows:
        tbl.append("<w:tr>")
        for cell in row:
            cell = cell.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            tbl.append("<w:tc><w:p><w:r><w:t>{}</w:t></w:r></w:p></w:tc>".format(cell))
        tbl.append("</w:tr>")
    tbl.append("</w:tbl>")
    return "".join(tbl)


def write_simple_docx(path: str, title: str, sections: List[Dict[str, Any]]) -> None:
    today = dt.date.today().isoformat()
    body_parts = [_docx_paragraph(title, "Heading1")]
    body_parts.append(_docx_paragraph(""))
    body_parts.append(_docx_paragraph("Purpose", "Heading2"))
    body_parts.append(
        _docx_paragraph(
            "This template is designed for enterprise IT documentation."
        )
    )
    body_parts.append(_docx_paragraph(""))

    body_parts.append(_docx_paragraph("Document Control", "Heading2"))
    body_parts.append(
        _docx_table(
            [
                ["Version", "1.0"],
                ["Owner", "IT Operations"],
                ["Last Updated", today],
            ]
        )
    )
    body_parts.append(_docx_paragraph(""))

    for section in sections:
        body_parts.append(_docx_paragraph(section["title"], "Heading2"))
        for line in section.get("lines", []):
            body_parts.append(_docx_paragraph(line))
        body_parts.append(_docx_paragraph(""))

    body_parts.append(_docx_paragraph("Revision History", "Heading2"))
    body_parts.append(_docx_paragraph("- Version: 1.0"))
    body_parts.append(_docx_paragraph("- Last Updated:"))

    sect_pr = (
        "<w:sectPr>"
        "<w:headerReference w:type=\"default\" r:id=\"rId1\"/>"
        "<w:footerReference w:type=\"default\" r:id=\"rId2\"/>"
        "<w:pgSz w:w=\"12240\" w:h=\"15840\"/>"
        "<w:pgMar w:top=\"1440\" w:right=\"1440\" w:bottom=\"1440\" w:left=\"1440\"/>"
        "</w:sectPr>"
    )

    document_xml = (
        "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"
        "<w:document xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\" "
        "xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\">"
        "<w:body>"
        + "".join(body_parts)
        + sect_pr
        + "</w:body></w:document>"
    )

    header_xml = (
        "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"
        "<w:hdr xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\">"
        "<w:p><w:r><w:t>Logo Placeholder</w:t></w:r></w:p>"
        "<w:p><w:r><w:t>Organization Name | IT Templates</w:t></w:r></w:p>"
        "</w:hdr>"
    )

    footer_xml = (
        "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"
        "<w:ftr xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\">"
        "<w:p><w:r><w:t>Organization Name | Internal Use</w:t></w:r></w:p>"
        "</w:ftr>"
    )

    content_types = (
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
        "<Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\">"
        "<Default Extension=\"rels\" ContentType=\"application/vnd.openxmlformats-package.relationships+xml\"/>"
        "<Default Extension=\"xml\" ContentType=\"application/xml\"/>"
        "<Override PartName=\"/word/document.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml\"/>"
        "<Override PartName=\"/word/header1.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml\"/>"
        "<Override PartName=\"/word/footer1.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml\"/>"
        "</Types>"
    )

    root_rels = (
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
        "<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">"
        "<Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument\" "
        "Target=\"word/document.xml\"/>"
        "</Relationships>"
    )

    document_rels = (
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
        "<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">"
        "<Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/header\" "
        "Target=\"header1.xml\"/>"
        "<Relationship Id=\"rId2\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer\" "
        "Target=\"footer1.xml\"/>"
        "</Relationships>"
    )

    with zipfile.ZipFile(path, "w", compression=zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", content_types)
        z.writestr("_rels/.rels", root_rels)
        z.writestr("word/document.xml", document_xml)
        z.writestr("word/header1.xml", header_xml)
        z.writestr("word/footer1.xml", footer_xml)
        z.writestr("word/_rels/document.xml.rels", document_rels)


# -------------------------
# Data definitions
# -------------------------

def xlsx_templates() -> Dict[str, Dict[str, Any]]:
    return {
        "change-management-log.xlsx": {
            "title": "IT Change Management Log",
            "headers": [
                "Change ID",
                "Title",
                "Owner",
                "Requester",
                "Category",
                "Risk",
                "Priority",
                "Planned Date",
                "Approval Status",
                "Implementation Status",
                "Rollback Plan",
                "Notes",
            ],
            "sample": [
                "CHG-2026-001",
                "M365 MFA Policy Update",
                "Alex Kim",
                "Security",
                "Identity",
                "Medium",
                "P2",
                "2026-03-20",
                "Approved",
                "Scheduled",
                "Revert CA policy",
                "Notify impacted users",
            ],
            "instructions": [
                "Use one row per change request.",
                "Assign a unique Change ID (CHG-YYYY-###).",
                "Capture approval status and implementation status separately.",
                "Document rollback steps before implementation.",
                "Update notes with communication and outcomes.",
            ],
        },
        "device-lifecycle-template.xlsx": {
            "title": "Device Lifecycle Management",
            "headers": [
                "Asset Tag",
                "Serial Number",
                "Model",
                "Assigned To",
                "Department",
                "Purchase Date",
                "Warranty End",
                "Lifecycle Stage",
                "Last Check-in",
                "Condition",
                "Replacement Date",
                "Notes",
            ],
            "sample": [
                "LT-1042",
                "C02XD12345",
                "MacBook Pro 14",
                "J. Smith",
                "Marketing",
                "2024-05-10",
                "2027-05-10",
                "In Service",
                "2026-03-01",
                "Good",
                "2027-06-01",
                "Battery health 92%",
            ],
            "instructions": [
                "Track each device from purchase to retirement.",
                "Use lifecycle stages: In Service, Spare, Repair, Retired.",
                "Update Last Check-in after inventory or MDM sync.",
                "Plan replacements 60-90 days before warranty end.",
            ],
        },
        "helpdesk-sla-tracker.xlsx": {
            "title": "Helpdesk SLA Tracking Dashboard",
            "headers": [
                "Ticket ID",
                "Requester",
                "Priority",
                "Opened",
                "First Response",
                "Resolved",
                "Response SLA",
                "Resolution SLA",
                "SLA Met",
                "Assigned To",
                "Category",
                "Notes",
            ],
            "sample": [
                "INC-100234",
                "L. Perez",
                "P2",
                "2026-03-10 09:18",
                "2026-03-10 09:42",
                "2026-03-10 11:30",
                "30m",
                "4h",
                "Yes",
                "Helpdesk Tier 1",
                "M365",
                "Outlook cached mode",
            ],
            "instructions": [
                "Track response and resolution times per ticket.",
                "Compare timestamps to SLA targets by priority.",
                "Set SLA Met to No when thresholds are missed.",
                "Use Category to group volume by service area.",
            ],
        },
        "it-asset-inventory-template.xlsx": {
            "title": "IT Asset Inventory",
            "headers": [
                "Asset Tag",
                "Type",
                "Model",
                "Serial Number",
                "Assigned To",
                "Location",
                "Department",
                "Purchase Date",
                "Warranty End",
                "Status",
                "Last Audit",
                "Notes",
            ],
            "sample": [
                "DT-2331",
                "Desktop",
                "Dell OptiPlex 7000",
                "9Q2X1",
                "R. Nasser",
                "NYC",
                "Finance",
                "2025-02-15",
                "2028-02-15",
                "In Use",
                "2026-03-05",
                "Docking station included",
            ],
            "instructions": [
                "Assign a unique asset tag to each device.",
                "Update Status during audits (In Use, Spare, Retired).",
                "Use Last Audit to track physical verification.",
                "Keep serial numbers consistent with vendor records.",
            ],
        },
        "it-budget-template.xlsx": {
            "title": "IT Budget Planning",
            "headers": [
                "Category",
                "Item",
                "Owner",
                "Annual Cost",
                "Monthly Cost",
                "Renewal Date",
                "Contract Term",
                "Vendor",
                "Status",
                "Notes",
            ],
            "sample": [
                "Software",
                "M365 E3 Licenses",
                "IT Ops",
                "$72,000",
                "$6,000",
                "2026-12-31",
                "12 months",
                "Microsoft",
                "Active",
                "Evaluate E5 for security",
            ],
            "instructions": [
                "List recurring costs and one-time purchases.",
                "Track renewal dates to avoid service gaps.",
                "Use Status for review cycles (Active, Review, Retire).",
                "Add Notes for optimization opportunities.",
            ],
        },
        "it-risk-register.xlsx": {
            "title": "IT Risk Register",
            "headers": [
                "Risk ID",
                "Risk Description",
                "Category",
                "Likelihood",
                "Impact",
                "Risk Rating",
                "Mitigation",
                "Owner",
                "Target Date",
                "Status",
                "Notes",
            ],
            "sample": [
                "R-019",
                "Unpatched VPN appliance",
                "Security",
                "Medium",
                "High",
                "High",
                "Accelerate patch window",
                "Security",
                "2026-03-25",
                "In Progress",
                "Coordinate maintenance window",
            ],
            "instructions": [
                "Rate Likelihood and Impact consistently (Low/Medium/High).",
                "Derive Risk Rating from Likelihood x Impact.",
                "Assign an owner and realistic target date.",
                "Update Status during risk reviews.",
            ],
        },
        "m365-license-tracker.xlsx": {
            "title": "Microsoft 365 License Tracker",
            "headers": [
                "User",
                "UPN",
                "License SKU",
                "Assigned Date",
                "Department",
                "Manager",
                "Cost Center",
                "Status",
                "Notes",
            ],
            "sample": [
                "Jamie Henderson",
                "jamie.henderson@company.com",
                "M365 E3",
                "2026-02-14",
                "Operations",
                "K. Singh",
                "OPS-120",
                "Active",
                "Has Power BI Pro",
            ],
            "instructions": [
                "Track assigned licenses per user.",
                "Use Status for reclaiming unused licenses.",
                "Add Notes for add-ons or exceptions.",
                "Keep Cost Center aligned with finance reporting.",
            ],
        },
        "patch-management-tracker.xlsx": {
            "title": "Patch Management Tracker",
            "headers": [
                "Patch ID",
                "KB/Release",
                "Severity",
                "Platform",
                "Deployment Ring",
                "Deployment Date",
                "Compliance %",
                "Rollback Required",
                "Owner",
                "Status",
                "Notes",
            ],
            "sample": [
                "PATCH-2026-03",
                "KB503021",
                "Critical",
                "Windows 11",
                "Pilot",
                "2026-03-12",
                "92%",
                "No",
                "Endpoint Team",
                "In Progress",
                "Reboot after install",
            ],
            "instructions": [
                "Track patches by release cycle and platform.",
                "Document compliance percentage per deployment ring.",
                "Flag rollback required when issues appear.",
                "Use Notes to capture outage risk or user comms.",
            ],
        },
        "risk-assessment-matrix.xlsx": {
            "title": "Cybersecurity Risk Assessment Matrix",
            "headers": [
                "Threat",
                "Asset",
                "Likelihood",
                "Impact",
                "Risk Score",
                "Existing Controls",
                "Treatment",
                "Owner",
                "Target Date",
                "Status",
                "Notes",
            ],
            "sample": [
                "Phishing",
                "Email",
                "High",
                "Medium",
                "High",
                "MFA, training",
                "Improve awareness",
                "Security",
                "2026-04-15",
                "Planned",
                "Run phishing simulation",
            ],
            "instructions": [
                "Use consistent scoring for Likelihood and Impact.",
                "Capture existing controls and planned treatment.",
                "Assign a target date for remediation steps.",
                "Update Status after each review cycle.",
            ],
        },
        "sox-compliance-tracker.xlsx": {
            "title": "SOX IT Compliance Tracker",
            "headers": [
                "Control ID",
                "Control Description",
                "Owner",
                "Test Frequency",
                "Last Test",
                "Next Test",
                "Evidence Link",
                "Status",
                "Findings",
                "Notes",
            ],
            "sample": [
                "SOX-IT-07",
                "Privileged access review",
                "IT Security",
                "Quarterly",
                "2026-01-15",
                "2026-04-15",
                "\\\\share\\sox\\Q1\\access-review.pdf",
                "Pass",
                "None",
                "Review exec sign-off",
            ],
            "instructions": [
                "Record evidence links for each control test.",
                "Use Status for Pass/Fail/Needs Review.",
                "Track next test date to stay audit-ready.",
                "Document any findings for remediation.",
            ],
        },
        "sso-mapping-template.xlsx": {
            "title": "Okta / Entra SSO Mapping",
            "headers": [
                "Application",
                "Owner",
                "SSO Protocol",
                "SSO URL",
                "Entity ID",
                "Claims Mapping",
                "Conditional Access",
                "Provisioning",
                "Status",
                "Notes",
            ],
            "sample": [
                "Salesforce",
                "Sales Ops",
                "SAML",
                "https://login.salesforce.com",
                "urn:force.com",
                "email, name",
                "MFA required",
                "SCIM",
                "Active",
                "Review quarterly",
            ],
            "instructions": [
                "Document each app's protocol and critical IDs.",
                "Capture claims mapping and provisioning type.",
                "Use Status to track onboarding progress.",
                "Note Conditional Access requirements for access policy.",
            ],
        },
    }


# -------------------------
# Docx templates
# -------------------------

def docx_templates() -> Dict[str, Dict[str, Any]]:
    return {
        "group-policy-documentation-template.docx": {
            "title": "Group Policy Documentation",
            "sections": [
                {
                    "title": "Overview",
                    "lines": [
                        "Policy Name:",
                        "Purpose:",
                        "Owner:",
                        "Scope / Linked OUs:",
                        "Date Created / Last Updated:",
                    ],
                },
                {
                    "title": "Settings Summary",
                    "lines": [
                        "- Category: (Security, User, Computer, Administrative Templates)",
                        "- Key Settings:",
                        "- Exceptions:",
                    ],
                },
                {
                    "title": "Implementation Details",
                    "lines": [
                        "- Security Filtering:",
                        "- WMI Filters:",
                        "- Inheritance / Block:",
                    ],
                },
                {
                    "title": "Testing & Validation",
                    "lines": [
                        "- Test Group:",
                        "- Validation Steps:",
                        "- Results:",
                        "- Rollback Plan:",
                    ],
                },
                {
                    "title": "Approvals",
                    "lines": [
                        "- Requested By:",
                        "- Approved By:",
                        "- Date:",
                    ],
                },
            ],
        },
        "it-project-status-template.docx": {
            "title": "IT Project Status Report",
            "sections": [
                {
                    "title": "Project Details",
                    "lines": [
                        "Project Name:",
                        "Project Manager:",
                        "Stakeholders:",
                        "Reporting Period:",
                    ],
                },
                {
                    "title": "Status Summary",
                    "lines": [
                        "Overall Status: (Green / Yellow / Red)",
                        "Key Achievements:",
                        "Upcoming Milestones:",
                    ],
                },
                {
                    "title": "Risks & Issues",
                    "lines": [
                        "- Risk/Issue:",
                        "- Impact:",
                        "- Mitigation:",
                    ],
                },
                {
                    "title": "Budget & Resourcing",
                    "lines": [
                        "- Budget Status:",
                        "- Resource Constraints:",
                        "- Vendor Updates:",
                    ],
                },
            ],
        },
        "vip-support-runbook.docx": {
            "title": "VIP Support Runbook",
            "sections": [
                {
                    "title": "Objective",
                    "lines": [
                        "Provide fast, high-touch support for executive users.",
                        "Document SLAs, escalation paths, and communication guidelines.",
                    ],
                },
                {
                    "title": "Service Levels",
                    "lines": [
                        "- Response SLA: 15 minutes",
                        "- Resolution SLA: 4 hours (target)",
                        "- After-hours contact: (phone / pager)",
                    ],
                },
                {
                    "title": "Escalation Path",
                    "lines": [
                        "- Tier 1: VIP Desk",
                        "- Tier 2: Senior Engineer",
                        "- Tier 3: Vendor / Security / Network Ops",
                    ],
                },
                {
                    "title": "Communication Standards",
                    "lines": [
                        "- Provide status updates every 30-60 minutes.",
                        "- Use executive-appropriate summaries.",
                        "- Log all actions in the ticket.",
                    ],
                },
                {
                    "title": "Common Scenarios",
                    "lines": [
                        "- Email access issues",
                        "- Conference room failures",
                        "- Device replacement and emergency loaners",
                    ],
                },
            ],
        },
    }


# -------------------------
# PDF templates
# -------------------------

def pdf_templates() -> Dict[str, Dict[str, Any]]:
    return {
        "incident-response-checklist.pdf": {
            "title": "Incident Response Checklist",
            "lines": [
                "Preparation",
                "* Validate incident severity and scope",
                "* Notify on-call and incident commander",
                "* Create incident channel and timeline",
                "",
                "Identification",
                "* Confirm indicators of compromise",
                "* Identify affected systems and users",
                "* Preserve evidence (logs, images)",
                "",
                "Containment",
                "* Isolate impacted systems",
                "* Disable compromised accounts",
                "* Apply temporary blocks / firewall rules",
                "",
                "Eradication",
                "* Remove malicious artifacts",
                "* Patch vulnerabilities and rotate secrets",
                "* Validate clean system state",
                "",
                "Recovery",
                "* Restore services and monitor health",
                "* Validate business workflows",
                "* Communicate status to stakeholders",
                "",
                "Post-Incident",
                "* Hold post-mortem and document learnings",
                "* Update detection and response playbooks",
            ],
        },
        "windows-hardening-checklist.pdf": {
            "title": "Windows Security Hardening Checklist",
            "lines": [
                "Baseline",
                "* Apply CIS or Microsoft Security Baseline",
                "* Enable BitLocker with recovery escrow",
                "* Enforce MFA for admin accounts",
                "",
                "Endpoint Protection",
                "* Enable Defender AV and cloud protection",
                "* Configure ASR rules",
                "* Enable controlled folder access",
                "",
                "Identity & Access",
                "* Disable local admin accounts",
                "* Enforce strong password policies",
                "* Review privileged group memberships",
                "",
                "Network",
                "* Enable firewall profiles",
                "* Disable legacy protocols (SMBv1)",
                "* Ensure VPN and DNS security settings",
                "",
                "Logging",
                "* Enable audit policies for logon and privilege use",
                "* Forward logs to SIEM",
            ],
        },
        "it-onboarding-checklist.pdf": {
            "title": "New Hire IT Onboarding Checklist",
            "lines": [
                "Before Day 1",
                "* Create user account and email",
                "* Assign device and accessories",
                "* Provision licenses and group access",
                "",
                "Day 1",
                "* Verify login and MFA setup",
                "* Install core applications",
                "* Configure VPN and Wi-Fi",
                "",
                "Week 1",
                "* Confirm access to shared resources",
                "* Introduce helpdesk and support channels",
                "* Validate backups / OneDrive sync",
            ],
        },
        "sharepoint-migration-checklist.pdf": {
            "title": "SharePoint Online Migration Checklist",
            "lines": [
                "Assessment",
                "* Inventory sites, libraries, and permissions",
                "* Identify content owners and sponsors",
                "* Decide migration waves",
                "",
                "Preparation",
                "* Clean up stale content",
                "* Map permissions and groups",
                "* Configure target site structure",
                "",
                "Migration",
                "* Run pilot migration",
                "* Validate files and metadata",
                "* Migrate remaining waves",
                "",
                "Post-Migration",
                "* Validate permissions and sharing settings",
                "* Train users and update documentation",
                "* Decommission legacy storage",
            ],
        },
        "av-event-triage-checklist.pdf": {
            "title": "Endpoint Antivirus Event Triage",
            "lines": [
                "Initial Triage",
                "* Validate alert source and timestamp",
                "* Identify affected device and user",
                "* Determine malware family or signature",
                "",
                "Containment",
                "* Isolate device if high risk",
                "* Block malicious hash or URL",
                "* Notify SOC or IT security",
                "",
                "Investigation",
                "* Collect logs and process details",
                "* Review recent user activity",
                "* Check for lateral movement",
                "",
                "Resolution",
                "* Remove or quarantine artifacts",
                "* Re-scan and validate clean status",
                "* Document findings and close ticket",
            ],
        },
    }


# -------------------------
# PowerShell scripts
# -------------------------

def write_ps1(path: str, content: str) -> None:
    ensure_dir(os.path.dirname(path))
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")


def ps1_scripts() -> Dict[str, str]:
    today = dt.date.today().isoformat()
    return {
        "ad-user-audit-script.ps1": f"""
<#!
.SYNOPSIS
    Export Active Directory users with status, last logon, and group memberships.
.DESCRIPTION
    Exports user audit data to CSV for reporting and cleanup reviews. Safe read-only.
.PARAMETER OutputPath
    Path for the CSV export. Default is a dated file in the current directory.
.PARAMETER IncludeDisabled
    Include disabled accounts (default: true).
.PARAMETER IncludeGroups
    Include group memberships as a semicolon-separated list (default: false).
.EXAMPLE
    .\\ad-user-audit-script.ps1 -IncludeGroups -OutputPath .\\ad-users.csv
#>
[CmdletBinding()]
param(
    [string]$OutputPath = "./ad-user-audit-{today}.csv",
    [bool]$IncludeDisabled = $true,
    [switch]$IncludeGroups,
    [string]$SearchBase
)

Import-Module ActiveDirectory -ErrorAction Stop

$filter = if ($IncludeDisabled) {{ "*" }} else {{ "Enabled -eq 'True'" }}

$props = @(
    "Enabled",
    "Title",
    "Department",
    "Manager",
    "LastLogonDate",
    "PasswordLastSet"
)

$params = @{{ Filter = $filter; Properties = $props }}
if ($SearchBase) {{ $params["SearchBase"] = $SearchBase }}

$users = Get-ADUser @params

$results = foreach ($user in $users) {{
    $groups = if ($IncludeGroups) {{
        (Get-ADPrincipalGroupMembership $user | Select-Object -ExpandProperty Name) -join "; "
    }} else {{
        ""
    }}

    [pscustomobject]@{{
        Name = $user.Name
        UserPrincipalName = $user.UserPrincipalName
        Enabled = $user.Enabled
        Title = $user.Title
        Department = $user.Department
        Manager = $user.Manager
        LastLogonDate = $user.LastLogonDate
        PasswordLastSet = $user.PasswordLastSet
        Groups = $groups
    }}
}}

$results | Sort-Object Name | Export-Csv -NoTypeInformation -Path $OutputPath
Write-Host "Exported" $results.Count "users to" $OutputPath
""",
        "ad-stale-computer-cleanup.ps1": f"""
<#!
.SYNOPSIS
    Report (and optionally disable) stale AD computer objects.
.DESCRIPTION
    Finds computer accounts with last logon timestamp older than StaleDays.
    By default, exports a report only. Use -DisableStale to disable.
.PARAMETER StaleDays
    Number of days since last logon to consider stale.
.PARAMETER OutputPath
    CSV output path.
.PARAMETER DisableStale
    Disable stale computer accounts (requires permissions).
.EXAMPLE
    .\\ad-stale-computer-cleanup.ps1 -StaleDays 90 -OutputPath .\\stale-computers.csv
#>
[CmdletBinding(SupportsShouldProcess=$true)]
param(
    [int]$StaleDays = 90,
    [string]$OutputPath = "./ad-stale-computers-{today}.csv",
    [switch]$DisableStale,
    [string]$SearchBase
)

Import-Module ActiveDirectory -ErrorAction Stop

$cutoff = (Get-Date).AddDays(-1 * $StaleDays)

$params = @{{
    Filter = "*"
    Properties = @("LastLogonTimestamp","Enabled")
}}
if ($SearchBase) {{ $params["SearchBase"] = $SearchBase }}

$computers = Get-ADComputer @params | Where-Object {{
    $_.LastLogonTimestamp -and
    ([datetime]::FromFileTime($_.LastLogonTimestamp)) -lt $cutoff
}}

$results = foreach ($computer in $computers) {{
    $lastLogon = [datetime]::FromFileTime($computer.LastLogonTimestamp)
    if ($DisableStale) {{
        if ($PSCmdlet.ShouldProcess($computer.Name, "Disable AD computer account")) {{
            Disable-ADAccount -Identity $computer.DistinguishedName
        }}
    }}
    [pscustomobject]@{{
        Name = $computer.Name
        DistinguishedName = $computer.DistinguishedName
        Enabled = $computer.Enabled
        LastLogon = $lastLogon
        StaleDays = (New-TimeSpan -Start $lastLogon -End (Get-Date)).Days
    }}
}}

$results | Sort-Object StaleDays -Descending | Export-Csv -NoTypeInformation -Path $OutputPath
Write-Host "Found" $results.Count "stale computers. Report written to" $OutputPath
""",
        "entra-app-audit-script.ps1": f"""
<#!
.SYNOPSIS
    Export Entra ID app registrations with credential expiry dates.
.DESCRIPTION
    Uses Microsoft Graph to export app registrations, owners, and secret/cert expiry.
    Requires Graph SDK and App.Read.All permissions.
.EXAMPLE
    .\\entra-app-audit-script.ps1 -OutputPath .\\entra-apps.csv
#>
[CmdletBinding()]
param(
    [string]$OutputPath = "./entra-app-audit-{today}.csv"
)

if (-not (Get-Module -ListAvailable -Name Microsoft.Graph)) {{
    Write-Error "Microsoft.Graph module not found. Install-Module Microsoft.Graph"
    exit 1
}}

Import-Module Microsoft.Graph -ErrorAction Stop

$scopes = @("Application.Read.All", "Directory.Read.All")
Connect-MgGraph -Scopes $scopes | Out-Null

$apps = Get-MgApplication -All

$results = foreach ($app in $apps) {{
    $secrets = ($app.PasswordCredentials | ForEach-Object {{ $_.EndDateTime }}) -join "; "
    $certs = ($app.KeyCredentials | ForEach-Object {{ $_.EndDateTime }}) -join "; "

    [pscustomobject]@{{
        DisplayName = $app.DisplayName
        AppId = $app.AppId
        CreatedDateTime = $app.CreatedDateTime
        SecretExpiry = $secrets
        CertExpiry = $certs
    }}
}}

$results | Sort-Object DisplayName | Export-Csv -NoTypeInformation -Path $OutputPath
Write-Host "Exported" $results.Count "app registrations to" $OutputPath
""",
        "entra-mfa-status-script.ps1": f"""
<#!
.SYNOPSIS
    Export MFA registration status for Entra ID users.
.DESCRIPTION
    Uses Microsoft Graph reports endpoint to export MFA registration details.
    Requires Reports.Read.All permission.
.EXAMPLE
    .\\entra-mfa-status-script.ps1 -OutputPath .\\mfa-status.csv
#>
[CmdletBinding()]
param(
    [string]$OutputPath = "./entra-mfa-status-{today}.csv"
)

if (-not (Get-Module -ListAvailable -Name Microsoft.Graph)) {{
    Write-Error "Microsoft.Graph module not found. Install-Module Microsoft.Graph"
    exit 1
}}

Import-Module Microsoft.Graph -ErrorAction Stop

$scopes = @("Reports.Read.All", "Directory.Read.All")
Connect-MgGraph -Scopes $scopes | Out-Null

$details = Get-MgReportAuthenticationMethodUserRegistrationDetail -All

$results = foreach ($row in $details) {{
    [pscustomobject]@{{
        UserPrincipalName = $row.UserPrincipalName
        DisplayName = $row.DisplayName
        IsMfaRegistered = $row.IsMfaRegistered
        MethodsRegistered = ($row.MethodsRegistered -join "; ")
        IsAdmin = $row.IsAdmin
    }}
}}

$results | Sort-Object UserPrincipalName | Export-Csv -NoTypeInformation -Path $OutputPath
Write-Host "Exported" $results.Count "records to" $OutputPath
""",
        "m365-bulk-license-script.ps1": f"""
<#!
.SYNOPSIS
    Assign or remove Microsoft 365 licenses in bulk using Graph.
.DESCRIPTION
    Reads a CSV file with UserPrincipalName and SkuId columns.
    Supports Assign or Remove actions.
.EXAMPLE
    .\\m365-bulk-license-script.ps1 -CsvPath .\\licenses.csv -Action Assign
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string]$CsvPath,
    [ValidateSet("Assign","Remove")]
    [string]$Action = "Assign"
)

if (-not (Get-Module -ListAvailable -Name Microsoft.Graph)) {{
    Write-Error "Microsoft.Graph module not found. Install-Module Microsoft.Graph"
    exit 1
}}

Import-Module Microsoft.Graph -ErrorAction Stop

$scopes = @("User.ReadWrite.All", "Organization.Read.All")
Connect-MgGraph -Scopes $scopes | Out-Null

$rows = Import-Csv $CsvPath

foreach ($row in $rows) {{
    $user = Get-MgUser -UserId $row.UserPrincipalName
    if (-not $user) {{
        Write-Warning "User not found: $($row.UserPrincipalName)"
        continue
    }}

    $sku = $row.SkuId
    if ($Action -eq "Assign") {{
        Set-MgUserLicense -UserId $user.Id -AddLicenses @(@{{SkuId=$sku}}) -RemoveLicenses @()
        Write-Host "Assigned" $sku "to" $row.UserPrincipalName
    }} else {{
        Set-MgUserLicense -UserId $user.Id -AddLicenses @() -RemoveLicenses @($sku)
        Write-Host "Removed" $sku "from" $row.UserPrincipalName
    }}
}}

Write-Host "Completed bulk license" $Action
""",
        "mailbox-permission-audit.ps1": f"""
<#!
.SYNOPSIS
    Export Exchange Online mailbox permissions.
.DESCRIPTION
    Exports Full Access, Send As, and Send on Behalf permissions for all mailboxes.
    Requires ExchangeOnlineManagement module.
.EXAMPLE
    .\\mailbox-permission-audit.ps1 -OutputPath .\\mailbox-permissions.csv
#>
[CmdletBinding()]
param(
    [string]$OutputPath = "./mailbox-permission-audit-{today}.csv"
)

if (-not (Get-Module -ListAvailable -Name ExchangeOnlineManagement)) {{
    Write-Error "ExchangeOnlineManagement module not found. Install-Module ExchangeOnlineManagement"
    exit 1
}}

Import-Module ExchangeOnlineManagement -ErrorAction Stop

Connect-ExchangeOnline -ShowBanner:$false

$mailboxes = Get-EXOMailbox -ResultSize Unlimited

$results = foreach ($mb in $mailboxes) {{
    $fullAccess = (Get-EXOMailboxPermission -Identity $mb.UserPrincipalName | Where-Object {{ $_.AccessRights -contains "FullAccess" -and -not $_.IsInherited }} | Select-Object -ExpandProperty User) -join "; "
    $sendAs = (Get-EXORecipientPermission -Identity $mb.UserPrincipalName | Where-Object {{ $_.AccessRights -contains "SendAs" }} | Select-Object -ExpandProperty Trustee) -join "; "
    $sendOnBehalf = ($mb.GrantSendOnBehalfTo | ForEach-Object {{ $_.Name }}) -join "; "

    [pscustomobject]@{{
        Mailbox = $mb.UserPrincipalName
        DisplayName = $mb.DisplayName
        FullAccess = $fullAccess
        SendAs = $sendAs
        SendOnBehalf = $sendOnBehalf
    }}
}}

$results | Sort-Object Mailbox | Export-Csv -NoTypeInformation -Path $OutputPath
Write-Host "Exported" $results.Count "mailboxes to" $OutputPath
""",
    }


# -------------------------
# Main
# -------------------------

def main() -> None:
    ensure_dir(OUT_DIR)

    for filename, data in xlsx_templates().items():
        path = os.path.join(OUT_DIR, filename)
        write_simple_xlsx(
            path,
            data["title"],
            data["headers"],
            data["sample"],
            data["instructions"],
        )

    for filename, data in docx_templates().items():
        path = os.path.join(OUT_DIR, filename)
        write_simple_docx(path, data["title"], data["sections"])

    for filename, data in pdf_templates().items():
        path = os.path.join(OUT_DIR, filename)
        write_simple_pdf(path, data["title"], data["lines"])

    for filename, content in ps1_scripts().items():
        path = os.path.join(OUT_DIR, filename)
        write_ps1(path, content)


if __name__ == "__main__":
    main()
