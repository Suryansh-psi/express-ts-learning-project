import postModel from "./post.model";
import Post from "./post.interface";

class PostService {
    private post = postModel;

    public create = async (title: string, body: string) : Promise<Post> => {
        try {
            const post = await this.post.create({title, body});

            return post;
        } catch (e: any) {
            throw new Error("Unable to create post");
        }
    }
}

export default PostService;