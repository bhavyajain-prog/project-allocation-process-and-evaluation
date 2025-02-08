import React, { useState, useEffect } from "react";
import Select from "react-select";
import logo from "./assets/logo.jpg";
import axios from "axios";

export default function CreateTeam() {
  const [code, setCode] = useState("");
  const [formData, setFormData] = useState({
    leader: {
      name: "",
      email: "",
      phone: "",
      rollNumber: "",
    },
    batch: "",
    project1: {
      title: "",
      description: "",
      technology: "",
    },
    project2: {
      title: "",
      description: "",
      technology: "",
    },
    mentorChoices: [null, null, null],
  });
  const [mentorOptions, setMentorOptions] = useState([]);
  const [remainingMentors, setRemainingMentors] = useState([]);

  useEffect(() => {
    const fetchCodeAndMentors = async () => {
      try {
        const codeResponse = await axios.get(
          "http://localhost:5000/api/team/code"
        );
        setCode(codeResponse.data.code);

        const mentorResponse = await axios.get(
          "http://localhost:5000/api/mentor/name"
        );
        const mentors = mentorResponse.data.mentors.map((mentor) => ({
          label: mentor.name,
          value: mentor.name,
        }));
        setMentorOptions(mentors);
        setRemainingMentors(mentors);
      } catch (err) {
        alert("Failed to load mentor data. Please try again later.");
      }
    };

    fetchCodeAndMentors();
  }, []);

  const handleChange = (e, field, index = null) => {
    if (field === "mentorChoices") {
      const updatedMentorChoices = [...formData.mentorChoices];
      updatedMentorChoices[index] = e;
      setFormData({ ...formData, mentorChoices: updatedMentorChoices });

      // Update remaining mentors
      const chosenMentors = updatedMentorChoices.filter((choice) => choice);
      const updatedRemaining = mentorOptions.filter(
        (mentor) =>
          !chosenMentors.some((choice) => choice.value === mentor.value)
      );
      setRemainingMentors(updatedRemaining);
    } else if (field === "project1" || field === "project2") {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [field]: {
          ...prevData[field],
          [name]: value,
        },
      }));
    } else if (field === "batch") {
      setFormData((prevData) => ({
        ...prevData,
        batch: e.target.value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        leader: {
          ...prevData.leader,
          [field]: e.target.value,
        },
      }));
    }
  };

  const createTeam = async (e) => {
    e.preventDefault();

    // Validate mentor choices
    if (formData.mentorChoices.some((choice) => !choice)) {
      alert("Please select all mentor choices.");
      return;
    }

    // Construct the request payload
    const teamData = {
      code: code,
      leader: {
        name: formData.leader.name,
        email: formData.leader.email,
        phone: formData.leader.phone,
        rollNumber: formData.leader.rollNumber,
      },
      batch: formData.batch,
      projectChoices: [
        {
          name: formData.project1.title,
          description: formData.project1.description,
          techStack: formData.project1.technology,
        },
        {
          name: formData.project2.title,
          description: formData.project2.description,
          techStack: formData.project2.technology,
        },
      ],
      mentorChoices: formData.mentorChoices.map((choice) => choice.value),
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/team/create",
        teamData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Team created successfully!");
      }
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Failed to create team. Please try again.");
    }
  };

  return (
    <div>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="container">
        <h2 className="title">Project Details</h2>
        <form onSubmit={createTeam} className="form-container">
          <div className="form-group">
            <label htmlFor="code">Team Code: </label>
            <input type="text" id="code" value={code} required disabled />
          </div>
          <div className="form-group">
            <h3>Leader Details</h3>
            <label htmlFor="leader-name">Leader Name: </label>
            <input
              type="text"
              id="leader-name"
              placeholder="Enter Leader Name"
              value={formData.leader.name}
              onChange={(e) => handleChange(e, "name")}
            />
            <br />
            <label htmlFor="leader-email">Leader Email: </label>
            <input
              type="email"
              id="leader-email"
              placeholder="Enter Leader Email"
              value={formData.leader.email}
              onChange={(e) => handleChange(e, "email")}
            />
            <br />
            <label htmlFor="leader-phone">Leader Phone: </label>
            <input
              type="text"
              id="leader-phone"
              placeholder="Enter Leader Phone"
              value={formData.leader.phone}
              onChange={(e) => handleChange(e, "phone")}
            />
            <br />
            <label htmlFor="leader-rollNumber">Leader Roll Number: </label>
            <input
              type="text"
              id="leader-rollNumber"
              placeholder="Enter Roll Number"
              value={formData.leader.rollNumber}
              onChange={(e) => handleChange(e, "rollNumber")}
            />
            <br />
            <label htmlFor="batch">Batch: </label>
            <input
              type="text"
              id="batch"
              placeholder="Enter batch"
              value={formData.batch}
              onChange={(e) => handleChange(e, "batch")}
            />
          </div>
          <div className="form-group">
            <h3>Project 1 Details</h3>
            <label>Title: </label>
            <input
              type="text"
              name="title"
              placeholder="Enter Project 1 Title"
              value={formData.project1.title}
              onChange={(e) => handleChange(e, "project1")}
            />
            <br />
            <label>Description: </label>
            <textarea
              name="description"
              placeholder="Enter Project 1 Description"
              value={formData.project1.description}
              onChange={(e) => handleChange(e, "project1")}
            />
            <br />
            <label>Technology: </label>
            <input
              type="text"
              name="technology"
              placeholder="Enter Project 1 Technology"
              value={formData.project1.technology}
              onChange={(e) => handleChange(e, "project1")}
            />
          </div>
          <div className="form-group">
            <h3>Project 2 Details</h3>
            <label>Title: </label>
            <input
              type="text"
              name="title"
              placeholder="Enter Project 2 Title"
              value={formData.project2.title}
              onChange={(e) => handleChange(e, "project2")}
            />
            <br />
            <label>Description: </label>
            <textarea
              name="description"
              placeholder="Enter Project 2 Description"
              value={formData.project2.description}
              onChange={(e) => handleChange(e, "project2")}
            />
            <br />
            <label>Technology: </label>
            <input
              type="text"
              name="technology"
              placeholder="Enter Project 2 Technology"
              value={formData.project2.technology}
              onChange={(e) => handleChange(e, "project2")}
            />
          </div>
          <div className="form-group">
            <h3>Mentor Selection</h3>
            {[0, 1, 2].map((index) => (
              <div key={index} className="mentor">
                <label>Choice {index + 1}</label>
                <Select
                  value={formData.mentorChoices[index]}
                  options={remainingMentors}
                  onChange={(e) => handleChange(e, "mentorChoices", index)}
                />
              </div>
            ))}
          </div>
          <button type="submit">Create Team</button>
        </form>
      </div>
    </div>
  );
}
