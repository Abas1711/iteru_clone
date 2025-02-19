const mongoose = require("mongoose");

const MuseumSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  opening_hours: { type: String, required: true },
  closing_hours: { type: String, required: true },
  ticket_prices: {
    adult: { type: String, default : null },
    child: { type: String, default : null },
            student: { type: String, default : null },
            senior: { type: String, default : null },
      foreign_adult: { type: String, default : null },
      foreign_student: { type: String, default : null },
      egyptian_adult: { type: String,  default : null },
      egyptian_student: { type: String,  default : null },
      egyptian_arabs:{ type: String,  default : null },
      foreigners:{ type: String,  default : null },
  },
  images: { type: [String], required: false },
  coverPicture: { type: String, required: false },
  last_ticket_time: { type: String, required: true },
  map_embed: { type: String, required: false },
},
{
toJSON: {
  transform: function (doc, ret) {
    delete ret.__v; 
  }
}
});

const Museum = mongoose.model("Museum", MuseumSchema);

module.exports = Museum;
