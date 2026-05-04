import { useEffect } from "react";

export default function PatientForm({ form, setForm }) {

  // ✅ FIXED (safe state update)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // ✅ AUTO AGE CALCULATION (CORRECT)
  useEffect(() => {
    if (form.dob) {
      const birth = new Date(form.dob);
      const today = new Date();

      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }

      setForm((prev) => ({ ...prev, age }));
    }
  }, [form.dob]);

  return (
    <>

      {/* ================= PATIENT INFO ================= */}
      <div className="section">
        <div className="section-title">Patient Information</div>

        <div className="row">
          <input name="surname" required placeholder="Surname *" className="input" onChange={handleChange}/>
          <input name="firstName" required placeholder="First Name *" className="input" onChange={handleChange}/>
          <input name="middleName" placeholder="Middle Name (Optional)" className="input" onChange={handleChange}/>
        </div>

        <div className="checkbox-group">
          {["Mr", "Miss", "Mrs", "Ms"].map((title) => (
            <label key={title}>
              <input type="radio" name="title" value={title} onChange={handleChange}/>
              {title}
            </label>
          ))}
        </div>

        <div className="row">
          <input type="date" name="dob" required className="input" onChange={handleChange}/>
          <input value={form.age || ""} readOnly placeholder="Age" className="input"/>
        </div>

        <div className="checkbox-group">
  <label><input type="radio" name="gender" value="Male" onChange={handleChange}/> Male</label>
  <label><input type="radio" name="gender" value="Female" onChange={handleChange}/> Female</label>
</div>

        <div className="row">
          <input name="occupation" placeholder="Occupation *" className="input" onChange={handleChange}/>
          <input name="email" placeholder="Email *" className="input" onChange={handleChange}/>

          <div className="radio-box">
            <label>Newsfeed?</label>
            <label><input type="radio" name="newsletter" value="Yes" onChange={handleChange}/> Yes</label>
            <label><input type="radio" name="newsletter" value="No" onChange={handleChange}/> No</label>
          </div>
        </div>

        {/* 🔥 FIXED (added onChange everywhere) */}
        <div className="row">
  <input name="address" required placeholder="Street Address *" className="input" onChange={handleChange}/>
  <input name="district" required placeholder="District *" className="input" onChange={handleChange}/>
  <input name="state" required placeholder="State *" className="input" onChange={handleChange}/>
  <input name="postalCode" required placeholder="Postal Code *" className="input" onChange={handleChange}/>
</div>

        <div className="row">
          <input name="mobile" required placeholder="Mobile *" className="input" onChange={handleChange}/>
          <input name="homePhone" placeholder="Home Phone (Optional)" className="input" onChange={handleChange}/>
          <input name="workPhone" placeholder="Work Phone (Optional)" className="input" onChange={handleChange}/>
        </div>

        <div className="row">
          <input name="fatherName" required placeholder="Father Name *" className="input" onChange={handleChange}/>
          <input name="fatherOccupation" placeholder="Father Occupation *" className="input" onChange={handleChange}/>
          <input name="fatherMobile" required placeholder="Father Mobile *" className="input" onChange={handleChange}/>
        </div>

        {/* ================= INSURANCE ================= */}
        <div className="row">
  <div className="radio-box">
    <label>Insurance?</label>
    <label><input type="radio" name="insurance" value="Yes" onChange={handleChange}/> Yes</label>
    <label><input type="radio" name="insurance" value="No" onChange={handleChange}/> No</label>
  </div>

  {/* 🔥 NEW FIELD */}
  <input
    name="diagnosedWith"
    placeholder="Diagnosed With"
    className="input"
    onChange={handleChange}
  />
</div>

        {/* ✅ CONDITIONAL WORKING */}
        {form.insurance === "Yes" && (
          <div className="row">
            <input name="insuranceDetails" placeholder="Insurance Fund Name" className="input full" onChange={handleChange}/>
          </div>
        )}

      </div>

      {/* ================= REFERRAL ================= */}
      <div className="section">
        <div className="section-title">Referral Information</div>

        <div className="radio-grid">
          {["Doctor", "Friends/Relatives", "Google", "Self"].map((item) => (
            <label key={item}>
              <input type="radio" name="referral" value={item} onChange={handleChange}/>
              {item}
            </label>
          ))}
        </div>

        {/* ✅ CONDITIONAL DOCTOR FIELD */}
        {form.referral === "Doctor" && (
          <div className="row">
            <input name="doctorRef" placeholder="Doctor Name" className="input full" onChange={handleChange}/>
          </div>
        )}

        {/* ================= GYM ================= */}
        <div className="row">
          <div className="radio-box">
            <label>Gym Member?</label>
            <label><input type="radio" name="gym" value="Yes" onChange={handleChange}/> Yes</label>
            <label><input type="radio" name="gym" value="No" onChange={handleChange}/> No</label>
          </div>
        </div>

        {/* ✅ CONDITIONAL GYM FIELD */}
        {form.gym === "Yes" && (
          <div className="row">
            <input name="gymName" placeholder="Gym Name" className="input full" onChange={handleChange}/>
          </div>
        )}
      </div>

      {/* ================= MEDICAL ================= */}
      <div className="section">
        <div className="section-title">Medical History</div>

        <textarea
          name="medicalHistory"
          placeholder="Write medical history..."
          className="textarea"
          onChange={handleChange}
        />
      </div>

      {/* ================= EMERGENCY ================= */}
      <div className="section">
        <div className="section-title">Emergency Contact</div>

        <div className="row">
          <input name="emergencyName"  placeholder="Name *" className="input" onChange={handleChange}/>
          <input name="relationship"  placeholder="Relationship *" className="input" onChange={handleChange}/>
          <input name="emergencyPhone"  placeholder="Phone *" className="input" onChange={handleChange}/>
        </div>
      </div>

    </>
  );
}
