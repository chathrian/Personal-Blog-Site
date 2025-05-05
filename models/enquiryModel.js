import {model, models, Schema} from "mongoose";


const enquirySchema = new Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    message: {
        type: String,
        required:true
    },
    date: {
        type: Date,
        required:true
    },
},{toJSON:{virtuals: true}});

enquirySchema.virtual('enquirydate').get(function(){
    return formatDate(this.date)
});

function formatDate(dateString) {
    const date = new Date(dateString);
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

const EnquiryModel = models.Enquiry || model('Enquiry', enquirySchema);

export default EnquiryModel;