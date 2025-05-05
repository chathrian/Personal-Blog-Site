import { Schema , model, models} from "mongoose";

const postSchema = new Schema({
    title:  {
        type: String,
        required:true
    },
    description: {
        type: String,
        required:true
    },
    image:  {
        type: String,
        required:true
    },
    created_at: {
        type: String,
        required:true
    },
},{toJSON:{virtuals: true}});

postSchema.virtual('short_description').get(function(){
    return this.description.substr(0, 100)+'...'
});
postSchema.virtual('date').get(function(){
    return formatDate(this.created_at)
});

function formatDate(dateString) {
    const date = new Date(dateString);
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
  
const PostModal = models.post || model('post', postSchema);

export default PostModal;