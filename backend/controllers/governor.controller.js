import Governor from "../models/governor.model.js";
import Email from "../models/email.model.js";
import Username from "../models/username.model.js";

export const deleteGovernor = async (req, res) => {
  try {
    const governor = await Governor.findByIdAndDelete(req.params.id);

    if (governor) {
      // Delete email associated with the governor
      await Email.findByIdAndDelete(governor.email);

      // Delete username associated with the governor
      await Username.findByIdAndDelete(governor.username);

      res.json({ message: "Governor deleted successfully" });
    } else {
      res.status(404).json({ message: "Governor not found" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
