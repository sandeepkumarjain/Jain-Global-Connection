import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MatrimonialProfile } from '../types';

export async function generateBiodataPDF(profile: MatrimonialProfile, isUnlocked: boolean = true): Promise<void> {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = 'Georgia, serif, system-ui, -apple-system, sans-serif';
  container.style.padding = '28px';
  container.style.boxSizing = 'border-box';

  const photoSrc = profile.photoUrl || '';

  const selfGotra = profile.fourGotras?.selfGotra || profile.gotra || 'N/A';
  const motherGotra = profile.fourGotras?.motherGotra || 'N/A';
  const fatherMotherGotra = profile.fourGotras?.fatherMotherGotra || 'N/A';
  const motherMotherGotra = profile.fourGotras?.motherMotherGotra || 'N/A';

  const manglik = profile.horoscopeDetails?.manglikStatus || 'Non-Manglik';
  const kundali = profile.horoscopeDetails?.kundaliMatchNeeded || 'Required';
  const rashi = profile.horoscopeDetails?.rashi || 'N/A';
  const nakshatra = profile.horoscopeDetails?.nakshatra || 'N/A';

  const degree = profile.educationDetails?.degreeLevel || 'Graduate';
  const institute = profile.educationDetails?.instituteName || 'N/A';
  const company = profile.company || profile.careerDetails?.companyName || 'N/A';

  const familyStatus = profile.familyBackground?.familyStatus || 'Upper Middle Class';
  const familyType = profile.familyBackground?.familyType || 'Joint Family';
  const familyValues = profile.familyBackground?.familyValues || 'Traditional Jain';
  const fatherName = profile.familyBackground?.fatherName || 'N/A';
  const fatherOcc = profile.familyBackground?.fatherOccupation || 'N/A';
  const motherName = profile.familyBackground?.motherName || 'N/A';
  const motherOcc = profile.familyBackground?.motherOccupation || 'N/A';
  const brothers = profile.familyBackground?.brothersCount ?? 0;
  const sisters = profile.familyBackground?.sistersCount ?? 0;
  const familyProp = profile.familyBackground?.familyProperty || profile.familyDetails || 'N/A';

  const guardianName = profile.guardianContact?.name || profile.fullName;
  const guardianRelation = profile.guardianContact?.relation || 'Guardian';
  const rawPhone = profile.guardianContact?.phone || profile.contactMobile || '+91 98000 00000';
  const rawEmail = profile.guardianContact?.email || profile.contactEmail || 'candidate@jainconnect.org';

  const guardianPhone = isUnlocked ? rawPhone : `${rawPhone.substring(0, 5)} ******** (Locked)`;
  const guardianEmail = isUnlocked ? rawEmail : `${rawEmail.substring(0, 3)}*****@jainconnect.org (Locked)`;

  container.innerHTML = `
    <div style="border: 3px double #d97706; padding: 24px; background: #ffffff; border-radius: 12px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
      <!-- Header -->
      <div style="text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 14px; margin-bottom: 18px; background: linear-gradient(135deg, #78350f, #451a03); color: #ffffff; padding: 18px; border-radius: 8px;">
        <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #fef3c7; font-weight: bold; margin-bottom: 4px;">
          🪔 卐 JAINCONNECT GLOBAL OFFICIAL MATRIMONIAL PORTAL 卐 🪔
        </div>
        <h1 style="margin: 0; font-size: 24px; font-family: Georgia, serif; font-weight: bold; color: #ffffff; letter-spacing: 0.5px;">
          JAIN MATRIMONIAL BIODATA
        </h1>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #fde68a;">
          Verified Candidate Profile • Confidential Family Document
        </p>
      </div>

      <!-- Main Profile Header Card -->
      <div style="display: flex; gap: 20px; align-items: flex-start; background: #fffbeb; border: 1px solid #fde68a; padding: 16px; border-radius: 8px; margin-bottom: 18px;">
        <div style="width: 120px; height: 150px; border: 3px solid #d97706; border-radius: 8px; overflow: hidden; background: #fef3c7; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
          ${
            photoSrc
              ? `<img src="${photoSrc}" style="width: 100%; height: 100%; object-fit: cover;" crossorigin="anonymous" />`
              : `<div style="text-align: center; color: #92400e; font-size: 11px; font-weight: bold; padding: 8px;">Candidate Photo</div>`
          }
        </div>
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <h2 style="margin: 0; font-size: 22px; color: #78350f; font-family: Georgia, serif; font-weight: bold;">
              ${profile.fullName}
            </h2>
            <span style="background: #d97706; color: #ffffff; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: bold; text-transform: uppercase;">
              ${profile.gender}
            </span>
          </div>

          <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: bold; color: #92400e;">
            ${profile.age} Years | Height: ${profile.height} | Marital Status: ${profile.maritalStatus}
          </p>

          <table style="width: 100%; font-size: 12px; color: #334155; border-collapse: collapse;">
            <tr>
              <td style="padding: 3px 0; font-weight: bold; width: 32%; color: #64748b;">Jain Sect:</td>
              <td style="padding: 3px 0; font-weight: bold; color: #0f172a;">${profile.sect} ${profile.subSect ? `(${profile.subSect})` : ''}</td>
            </tr>
            <tr>
              <td style="padding: 3px 0; font-weight: bold; color: #64748b;">Mother Tongue:</td>
              <td style="padding: 3px 0; color: #0f172a;">${profile.motherTongue || 'Gujarati'}</td>
            </tr>
            <tr>
              <td style="padding: 3px 0; font-weight: bold; color: #64748b;">Native Place (Vatan):</td>
              <td style="padding: 3px 0; color: #0f172a;">${profile.nativePlace || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 3px 0; font-weight: bold; color: #64748b;">Current Residence:</td>
              <td style="padding: 3px 0; color: #0f172a;">${profile.city}, ${profile.state}, ${profile.country}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Section 1: Sacred 4-Gotra Lineage -->
      <div style="margin-bottom: 14px;">
        <div style="background: #78350f; color: #ffffff; padding: 5px 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; border-radius: 4px; letter-spacing: 0.5px; margin-bottom: 6px;">
          1. SACRED JAIN 4-GOTRA LINEAGE & NATIVE VATAN
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; background: #fafafa; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 7px 10px; font-weight: bold; color: #475569; width: 25%; background: #f1f5f9;">1. Self / Father Gotra:</td>
            <td style="padding: 7px 10px; font-weight: bold; color: #0f172a; width: 25%;">${selfGotra}</td>
            <td style="padding: 7px 10px; font-weight: bold; color: #475569; width: 25%; background: #f1f5f9;">2. Mother Maiden Gotra:</td>
            <td style="padding: 7px 10px; font-weight: bold; color: #0f172a; width: 25%;">${motherGotra}</td>
          </tr>
          <tr>
            <td style="padding: 7px 10px; font-weight: bold; color: #475569; background: #f1f5f9;">3. Dadi (Paternal) Gotra:</td>
            <td style="padding: 7px 10px; font-weight: bold; color: #0f172a;">${fatherMotherGotra}</td>
            <td style="padding: 7px 10px; font-weight: bold; color: #475569; background: #f1f5f9;">4. Nani (Maternal) Gotra:</td>
            <td style="padding: 7px 10px; font-weight: bold; color: #0f172a;">${motherMotherGotra}</td>
          </tr>
        </table>
      </div>

      <!-- Section 2: Birth & Horoscope Details -->
      <div style="margin-bottom: 14px;">
        <div style="background: #78350f; color: #ffffff; padding: 5px 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; border-radius: 4px; letter-spacing: 0.5px; margin-bottom: 6px;">
          2. BIRTH, HOROSCOPE & PHYSICAL DETAILS
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; background: #fafafa; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 7px 10px; font-weight: bold; color: #475569; width: 25%; background: #f1f5f9;">Date of Birth:</td>
            <td style="padding: 7px 10px; font-weight: bold; color: #0f172a; width: 25%;">${profile.dob}</td>
            <td style="padding: 7px 10px; font-weight: bold; color: #475569; width: 25%; background: #f1f5f9;">Time & Place of Birth:</td>
            <td style="padding: 7px 10px; color: #0f172a; width: 25%;">${profile.tob || 'N/A'} (${profile.pob || profile.city})</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 7px 10px; font-weight: bold; color: #475569; background: #f1f5f9;">Manglik Status:</td>
            <td style="padding: 7px 10px; font-weight: bold; color: #0f172a;">${manglik}</td>
            <td style="padding: 7px 10px; font-weight: bold; color: #475569; background: #f1f5f9;">Kundali Matching:</td>
            <td style="padding: 7px 10px; color: #0f172a;">${kundali}</td>
          </tr>
          <tr>
            <td style="padding: 7px 10px; font-weight: bold; color: #475569; background: #f1f5f9;">Rashi / Nakshatra:</td>
            <td style="padding: 7px 10px; color: #0f172a;">${rashi} / ${nakshatra}</td>
            <td style="padding: 7px 10px; font-weight: bold; color: #475569; background: #f1f5f9;">Diet Preference:</td>
            <td style="padding: 7px 10px; font-weight: bold; color: #166534;">${profile.dietPreference}</td>
          </tr>
        </table>
      </div>

      <!-- Section 3: Academic & Career Credentials -->
      <div style="margin-bottom: 14px;">
        <div style="background: #78350f; color: #ffffff; padding: 5px 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; border-radius: 4px; letter-spacing: 0.5px; margin-bottom: 6px;">
          3. ACADEMIC & PROFESSIONAL CREDENTIALS
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; background: #fafafa; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 7px 10px; font-weight: bold; color: #475569; width: 25%; background: #f1f5f9;">Qualification:</td>
            <td style="padding: 7px 10px; font-weight: bold; color: #0f172a; width: 25%;">${profile.qualification}</td>
            <td style="padding: 7px 10px; font-weight: bold; color: #475569; width: 25%; background: #f1f5f9;">Degree Level:</td>
            <td style="padding: 7px 10px; color: #0f172a; width: 25%;">${degree}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 7px 10px; font-weight: bold; color: #475569; background: #f1f5f9;">College / University:</td>
            <td style="padding: 7px 10px; color: #0f172a;">${institute}</td>
            <td style="padding: 7px 10px; font-weight: bold; color: #475569; background: #f1f5f9;">Occupation:</td>
            <td style="padding: 7px 10px; font-weight: bold; color: #0f172a;">${profile.occupation}</td>
          </tr>
          <tr>
            <td style="padding: 7px 10px; font-weight: bold; color: #475569; background: #f1f5f9;">Company / Business:</td>
            <td style="padding: 7px 10px; color: #0f172a;">${company}</td>
            <td style="padding: 7px 10px; font-weight: bold; color: #475569; background: #f1f5f9;">Annual Income:</td>
            <td style="padding: 7px 10px; font-weight: bold; color: #b45309;">${profile.annualIncome}</td>
          </tr>
        </table>
      </div>

      <!-- Section 4: Family Background & Standing -->
      <div style="margin-bottom: 14px;">
        <div style="background: #78350f; color: #ffffff; padding: 5px 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; border-radius: 4px; letter-spacing: 0.5px; margin-bottom: 6px;">
          4. FAMILY BACKGROUND & STANDING
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; background: #fafafa; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 7px 10px; font-weight: bold; color: #475569; width: 25%; background: #f1f5f9;">Father's Name & Occ:</td>
            <td style="padding: 7px 10px; font-weight: bold; color: #0f172a; width: 25%;">${fatherName} (${fatherOcc})</td>
            <td style="padding: 7px 10px; font-weight: bold; color: #475569; width: 25%; background: #f1f5f9;">Mother's Name & Occ:</td>
            <td style="padding: 7px 10px; font-weight: bold; color: #0f172a; width: 25%;">${motherName} (${motherOcc})</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 7px 10px; font-weight: bold; color: #475569; background: #f1f5f9;">Family Type & Values:</td>
            <td style="padding: 7px 10px; color: #0f172a;">${familyType} | ${familyValues}</td>
            <td style="padding: 8px 10px; font-weight: bold; color: #475569; background: #f1f5f9;">Siblings Summary:</td>
            <td style="padding: 7px 10px; color: #0f172a;">${brothers} Brother(s), ${sisters} Sister(s)</td>
          </tr>
          <tr>
            <td style="padding: 7px 10px; font-weight: bold; color: #475569; background: #f1f5f9;">Family Status / Assets:</td>
            <td colspan="3" style="padding: 7px 10px; color: #0f172a;">${familyStatus} • ${familyProp}</td>
          </tr>
        </table>
      </div>

      <!-- Section 5: Partner Expectations & Bio -->
      <div style="margin-bottom: 14px;">
        <div style="background: #78350f; color: #ffffff; padding: 5px 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; border-radius: 4px; letter-spacing: 0.5px; margin-bottom: 6px;">
          5. PARTNER EXPECTATIONS & CANDIDATE BIO
        </div>
        <div style="background: #fafafa; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px; font-size: 11px; color: #334155;">
          <p style="margin: 0 0 4px 0;"><strong>Preferred Age & Height:</strong> ${profile.partnerExpectations?.ageMin || 22} to ${profile.partnerExpectations?.ageMax || 28} Yrs | ${profile.partnerExpectations?.heightMin || "5'2\""} to ${profile.partnerExpectations?.heightMax || "5'10\""}</p>
          <p style="margin: 0 0 4px 0;"><strong>Preferred Sect & Location:</strong> ${profile.partnerExpectations?.sectPreferred || 'Open to all Jain Sects'} | ${profile.partnerExpectations?.locationPreferred || 'India / Overseas'}</p>
          <p style="margin: 6px 0 0 0; font-style: italic; color: #1e293b; border-top: 1px solid #e2e8f0; padding-top: 6px;">
            "${profile.aboutMe}"
          </p>
        </div>
      </div>

      <!-- Section 6: Guardian Contact Details -->
      <div style="margin-bottom: 14px;">
        <div style="background: #78350f; color: #ffffff; padding: 5px 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; border-radius: 4px; letter-spacing: 0.5px; margin-bottom: 6px;">
          6. GUARDIAN & CONTACT VERIFICATION
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; overflow: hidden;">
          <tr>
            <td style="padding: 7px 10px; font-weight: bold; color: #78350f; width: 25%;">Guardian Name:</td>
            <td style="padding: 7px 10px; font-weight: bold; color: #0f172a; width: 25%;">${guardianName} (${guardianRelation})</td>
            <td style="padding: 7px 10px; font-weight: bold; color: #78350f; width: 25%;">Phone / WhatsApp:</td>
            <td style="padding: 7px 10px; font-weight: bold; color: #92400e; width: 25%;">${guardianPhone}</td>
          </tr>
          <tr>
            <td style="padding: 7px 10px; font-weight: bold; color: #78350f;">Contact Email:</td>
            <td colspan="3" style="padding: 7px 10px; font-weight: bold; color: #0f172a;">${guardianEmail}</td>
          </tr>
        </table>
      </div>

      <!-- Footer -->
      <div style="text-align: center; font-size: 10px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 14px;">
        Generated by JainConnect Global Official Platform • Confidential Matrimonial Biodata Document • Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    const safeName = profile.fullName.replace(/[^a-zA-Z0-9]/g, '_');
    pdf.save(`Jain_Matrimonial_Biodata_${safeName}.pdf`);
  } catch (error) {
    console.error('PDF Generation error, attempting print fallback:', error);
    // Print fallback
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Jain Matrimonial Biodata - ${profile.fullName}</title>
            <style>
              body { font-family: Georgia, serif; padding: 20px; background: #fff; color: #0f172a; }
              @media print { body { padding: 0; } }
            </style>
          </head>
          <body>
            ${container.innerHTML}
            <script>
              window.onload = function() { window.print(); };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
