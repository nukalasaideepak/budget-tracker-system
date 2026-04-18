package com.budgetwise.repository;

import com.budgetwise.model.ForumLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ForumLikeRepository extends JpaRepository<ForumLike, Long> {
    long countByPostId(Long postId);
    boolean existsByPostIdAndUsername(Long postId, String username);
    Optional<ForumLike> findByPostIdAndUsername(Long postId, String username);
}

