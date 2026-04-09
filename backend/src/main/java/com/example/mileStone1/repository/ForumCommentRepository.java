package com.example.mileStone1.repository;

import com.example.mileStone1.model.ForumComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ForumCommentRepository extends JpaRepository<ForumComment, Long> {
    List<ForumComment> findByPostIdOrderByCreatedAtAsc(Long postId);
    long countByPostId(Long postId);
}
