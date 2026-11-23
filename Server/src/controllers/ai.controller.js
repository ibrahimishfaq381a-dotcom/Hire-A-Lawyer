import { Lawyer } from "../models/lawyer.model.js";

export const recommendLawyer = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Input text is required" });

    // Dynamic search in name + expertise
    const results = await Lawyer.find({
      $or: [
        { name: { $regex: text, $options: "i" } },
        { expertise: { $regex: text, $options: "i" } },
      ],
    }).limit(10);

    res.json({ data: results });
  } catch (err) {
    console.error("Recommend Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};