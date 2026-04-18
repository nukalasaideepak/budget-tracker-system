package com.budgetwise.service;

import com.budgetwise.model.ForumComment;
import com.budgetwise.model.ForumLike;
import com.budgetwise.model.ForumPost;
import com.budgetwise.repository.ForumCommentRepository;
import com.budgetwise.repository.ForumLikeRepository;
import com.budgetwise.repository.ForumPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ForumService {

    @Autowired
    private ForumPostRepository postRepository;

    @Autowired
    private ForumCommentRepository commentRepository;

    @Autowired
    private ForumLikeRepository likeRepository;

    // ── Posts ──

    public List<Map<String, Object>> getAllPosts(String currentUsername) {
        List<ForumPost> posts = postRepository.findAllByOrderByCreatedAtDesc();
        List<Map<String, Object>> result = new ArrayList<>();
        for (ForumPost post : posts) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", post.getId());
            map.put("username", post.getUsername());
            map.put("title", post.getTitle());
            map.put("content", post.getContent());
            map.put("createdAt", post.getCreatedAt());
            map.put("likeCount", likeRepository.countByPostId(post.getId()));
            map.put("commentCount", commentRepository.countByPostId(post.getId()));
            map.put("likedByMe", likeRepository.existsByPostIdAndUsername(post.getId(), currentUsername));
            result.add(map);
        }
        return result;
    }

    public ForumPost createPost(String username, ForumPost post) {
        post.setUsername(username);
        return postRepository.save(post);
    }

    public void deletePost(Long id, String username) {
        ForumPost post = postRepository.findById(id).orElseThrow();
        if (!post.getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }
        postRepository.deleteById(id);
    }

    // ── Comments ──

    public List<ForumComment> getComments(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
    }

    public ForumComment addComment(Long postId, String username, ForumComment comment) {
        comment.setPostId(postId);
        comment.setUsername(username);
        return commentRepository.save(comment);
    }

    // ── Likes ──

    public Map<String, Object> toggleLike(Long postId, String username) {
        Optional<ForumLike> existing = likeRepository.findByPostIdAndUsername(postId, username);
        boolean liked;
        if (existing.isPresent()) {
            likeRepository.delete(existing.get());
            liked = false;
        } else {
            ForumLike like = new ForumLike();
            like.setPostId(postId);
            like.setUsername(username);
            likeRepository.save(like);
            liked = true;
        }
        Map<String, Object> result = new HashMap<>();
        result.put("liked", liked);
        result.put("likeCount", likeRepository.countByPostId(postId));
        return result;
    }
}

