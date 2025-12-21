package com.conspiracy.forum.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class Theory {
    private String id;
    @NotBlank
    @Size(min = 3, message = "Title is too short for a credible conspiracy")
    private String title;
    @NotBlank
    @Size(min = 10, message = "Content must include more than a whisper")
    private String content;
    private Status status;
    private User author;
    private Instant postedAt;
    private final List<String> evidenceUrls = new ArrayList<>();
    private final List<Comment> comments = new ArrayList<>();
    private boolean anonymous;

    public Theory(String id, String title, String content, Status status, User author, Instant postedAt, List<String> evidenceUrls, boolean anonymous) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.status = status == null ? Status.UNVERIFIED : status;
        this.author = author;
        this.postedAt = postedAt == null ? Instant.now() : postedAt;
        if (evidenceUrls != null) {
            this.evidenceUrls.addAll(evidenceUrls);
        }
        this.anonymous = anonymous;
    }

    public Theory() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public Instant getPostedAt() {
        return postedAt;
    }

    public void setPostedAt(Instant postedAt) {
        this.postedAt = postedAt;
    }

    public List<String> getEvidenceUrls() {
        return evidenceUrls;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public boolean isAnonymous() {
        return anonymous;
    }

    public void setAnonymous(boolean anonymous) {
        this.anonymous = anonymous;
    }

    public int getCommentCount() {
        return comments.size();
    }

    public String getDisplayAuthor() {
        return anonymous ? "Anonymous Agent" : author.username();
    }
}
