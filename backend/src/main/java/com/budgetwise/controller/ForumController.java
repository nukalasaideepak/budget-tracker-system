package com.budgetwise.controller;

import com.budgetwise.model.ForumComment;
import com.budgetwise.model.ForumPost;
import com.budgetwise.service.ForumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/forum")
@CrossOrigin(origins = "http://localhost:3000")
public class ForumController {

    @Autowired
    private ForumService forumService;

    // ── Posts ──

    @GetMapping("/posts")
    public List<Map<String, Object>> getAllPosts(Authentication authentication) {
        return forumService.getAllPosts(authentication.getName());
    }

    @PostMapping("/posts")
    public ForumPost createPost(@RequestBody ForumPost post, Authentication authentication) {
        return forumService.createPost(authentication.getName(), post);
    }

    @DeleteMapping("/posts/{id}")
    public void deletePost(@PathVariable Long id, Authentication authentication) {
        forumService.deletePost(id, authentication.getName());
    }

    // ── Comments ──

    @GetMapping("/posts/{id}/comments")
    public List<ForumComment> getComments(@PathVariable Long id) {
        return forumService.getComments(id);
    }

    @PostMapping("/posts/{id}/comments")
    public ForumComment addComment(@PathVariable Long id,
                                   @RequestBody ForumComment comment,
                                   Authentication authentication) {
        return forumService.addComment(id, authentication.getName(), comment);
    }

    // ── Likes ──

    @PostMapping("/posts/{id}/like")
    public Map<String, Object> toggleLike(@PathVariable Long id, Authentication authentication) {
        return forumService.toggleLike(id, authentication.getName());
    }
}

