import { useState } from "react";
import API from "./services/api";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    fileUrl: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };
  console.log("file", file);
  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "jaq5meji");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/draoyfcay/image/upload",
      {
        method: "POST",
        body: data,
      },
    );

    const result = await res.json();
    return result.secure_url;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";

      if (file) {
        imageUrl = await uploadImage();
      }

      await API.post("/signup", {
        ...form,
        fileUrl: imageUrl,
      });

      alert("Signup Successful ✅");
      navigate("/");
    } catch (err) {
      console.log(err);
      alert("Signup Failed ");
    }
  };

  return (
    <div className="container mt-5">
      <form
        onSubmit={handleSignup}
        className="col-md-4 mx-auto card p-4 shadow"
      >
        <h3 className="text-center mb-3">Signup</h3>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="form-control mb-2"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control mb-2"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control mb-2"
          onChange={handleChange}
        />

        <input
          type="file"
          className="form-control mb-2"
          onChange={handleFileChange}
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="img-fluid mb-2"
            style={{ height: "150px", objectFit: "cover" }}
          />
        )}

        <button className="btn btn-success w-100">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
