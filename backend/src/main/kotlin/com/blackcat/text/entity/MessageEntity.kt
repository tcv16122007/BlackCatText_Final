package com.blackcat.text.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "messages")
data class MessageEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    val sender: String,

    @Column(nullable = false, columnDefinition = "NVARCHAR(MAX)")
    val content: String,

    @Column(name = "created_at", updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)