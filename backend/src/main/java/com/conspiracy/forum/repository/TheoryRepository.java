package com.conspiracy.forum.repository;

import com.conspiracy.forum.model.Theory;
import com.conspiracy.forum.model.TheoryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TheoryRepository extends JpaRepository<Theory, Long> {
    Page<Theory> findByStatus(TheoryStatus status, Pageable pageable);
    
    @Query("SELECT t FROM Theory t WHERE " +
           "LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.content) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Theory> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT t FROM Theory t WHERE t.status = :status AND " +
           "(LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.content) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Theory> findByStatusAndKeyword(@Param("status") TheoryStatus status, 
                                        @Param("keyword") String keyword, 
                                        Pageable pageable);
    
    List<Theory> findByAuthorId(Long authorId);
    
    @Query("SELECT t FROM Theory t LEFT JOIN t.comments c GROUP BY t.id ORDER BY COUNT(c) DESC")
    Page<Theory> findHotTheories(Pageable pageable);
}
