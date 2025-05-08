const mongoose = require("mongoose");

const MuseumSchema = new mongoose.Schema({
  name: { type: String, required: false },
  location: { type: String, required: false },
  description: { type: String, required: false },
  opening_hours: {
    type: Object,
    required: false
  }
,  
  closing_hours: { type: String, required: false },
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
  last_ticket_time: { type: String, required: false },
  map_embed: { type: String, required: false },
},
{
toJSON: {
  transform: function (doc, ret) {
    delete ret.__v; 
  }
}
});

const Monument = mongoose.model("Monuments", MuseumSchema);

module.exports = Monument;
