package com.conspiracy.forum.service;

import com.conspiracy.forum.model.Comment;
import com.conspiracy.forum.model.Status;
import com.conspiracy.forum.model.Theory;
import com.conspiracy.forum.model.User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class TheoryService {

    private static final String SECRET_CODE = "TRUSTNO1";
    private final Map<String, Theory> theories = new ConcurrentHashMap<>();
    private final Map<String, Comment> comments = new ConcurrentHashMap<>();
    private final Map<String, User> users = new ConcurrentHashMap<>();
    private final AtomicLong theoryIdSequence = new AtomicLong(1);
    private final AtomicLong commentIdSequence = new AtomicLong(1);
    private final AtomicLong userIdSequence = new AtomicLong(1);

    public TheoryService() {
        User admin = registerUser("Mulder", SECRET_CODE);
        Theory seeded = addTheory("Cigarette Smoking Man", "Government hides alien alliances.", Status.UNVERIFIED, admin, List.of("https://example.com/alien"), true);
        addComment(seeded.getId(), admin, "Need more photos.", true);
    }

    public User registerUser(String username, String secretCode) {
        if (!SECRET_CODE.equals(secretCode)) {
            throw new IllegalArgumentException("Secret code rejected. Only trusted agents may log in.");
        }
        Optional<User> existing = users.values().stream()
                .filter(user -> user.username().equalsIgnoreCase(username))
                .findFirst();
        if (existing.isPresent()) {
            return existing.get();
        }
        String id = String.valueOf(userIdSequence.getAndIncrement());
        User newUser = new User(id, username);
        users.put(id, newUser);
        return newUser;
    }

    public Theory addTheory(String title, String content, Status status, User author, List<String> evidenceUrls, boolean anonymous) {
        String id = String.valueOf(theoryIdSequence.getAndIncrement());
        Theory theory = new Theory(id, title, content, status, author, Instant.now(), evidenceUrls, anonymous);
        theories.put(id, theory);
        return theory;
    }

    public Theory updateTheory(String id, String title, String content, Status status, List<String> evidenceUrls, Boolean anonymous) {
        Theory theory = getTheory(id);
        if (title != null) {
            theory.setTitle(title);
        }
        if (content != null) {
            theory.setContent(content);
        }
        if (status != null) {
            theory.setStatus(status);
        }
        if (evidenceUrls != null) {
            theory.getEvidenceUrls().clear();
            theory.getEvidenceUrls().addAll(evidenceUrls);
        }
        if (anonymous != null) {
            theory.setAnonymous(anonymous);
        }
        return theory;
    }

    public Theory getTheory(String id) {
        Theory theory = theories.get(id);
        if (theory == null) {
            throw new IllegalArgumentException("Theory not found: " + id);
        }
        return theory;
    }

    public boolean deleteTheory(String id) {
        Theory removed = theories.remove(id);
        if (removed != null) {
            Set<String> toDelete = comments.values().stream()
                    .filter(comment -> comment.theoryId().equals(id))
                    .map(Comment::id)
                    .collect(Collectors.toSet());
            toDelete.forEach(comments::remove);
            return true;
        }
        return false;
    }

    public Comment addComment(String theoryId, User author, String content, boolean anonymous) {
        Theory theory = getTheory(theoryId);
        String id = String.valueOf(commentIdSequence.getAndIncrement());
        Comment comment = new Comment(id, theoryId, author, content, Instant.now(), anonymous);
        comments.put(id, comment);
        theory.getComments().add(comment);
        return comment;
    }

    public Comment updateComment(String id, String content) {
        Comment comment = comments.get(id);
        if (comment == null) {
            throw new IllegalArgumentException("Comment not found: " + id);
        }
        Comment updated = new Comment(comment.id(), comment.theoryId(), comment.author(), content, comment.postedAt(), comment.anonymous());
        comments.put(id, updated);
        Theory theory = theories.get(comment.theoryId());
        if (theory != null) {
            theory.getComments().replaceAll(existing -> existing.id().equals(id) ? updated : existing);
        }
        return updated;
    }

    public boolean deleteComment(String id) {
        Comment removed = comments.remove(id);
        if (removed != null) {
            Theory theory = theories.get(removed.theoryId());
            if (theory != null) {
                theory.getComments().removeIf(comment -> comment.id().equals(id));
            }
            return true;
        }
        return false;
    }

    public List<Theory> listTheories(Integer page, Integer size, Status status, String keyword, Boolean hot) {
        int resolvedPage = page == null || page < 0 ? 0 : page;
        int resolvedSize = size == null || size <= 0 ? 10 : size;
        Comparator<Theory> comparator = Comparator.comparing(Theory::getPostedAt).reversed();
        if (Boolean.TRUE.equals(hot)) {
            comparator = Comparator.comparing(Theory::getCommentCount).reversed().thenComparing(comparator);
        }
        List<Theory> filtered = theories.values().stream()
                .filter(theory -> status == null || theory.getStatus() == status)
                .filter(theory -> !StringUtils.hasText(keyword) || containsKeyword(theory, keyword))
                .sorted(comparator)
                .toList();
        int fromIndex = Math.min(resolvedPage * resolvedSize, filtered.size());
        int toIndex = Math.min(fromIndex + resolvedSize, filtered.size());
        return new ArrayList<>(filtered.subList(fromIndex, toIndex));
    }

    public int countTheories(Status status, String keyword, Boolean hot) {
        return theories.values().stream()
                .filter(theory -> status == null || theory.getStatus() == status)
                .filter(theory -> !StringUtils.hasText(keyword) || containsKeyword(theory, keyword))
                .mapToInt(it -> 1)
                .sum();
    }

    private boolean containsKeyword(Theory theory, String keyword) {
        String lower = keyword.toLowerCase();
        return theory.getTitle().toLowerCase().contains(lower) || theory.getContent().toLowerCase().contains(lower);
    }

    public List<Theory> findByUser(String userId) {
        return theories.values().stream()
                .filter(theory -> theory.getAuthor().id().equals(userId))
                .sorted(Comparator.comparing(Theory::getPostedAt).reversed())
                .toList();
    }

    public Optional<User> findUser(String userId) {
        return Optional.ofNullable(users.get(userId));
    }
}
