package com.blackcat.text.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(unique = true, nullable = false)
    val username: String,

    @Column(unique = true, nullable = false)
    val email: String,

    @Column(name = "password_hash", nullable = false)
    var passwordHash: String,

    @Column(name = "display_name")
    var displayName: String?,

    @Column(nullable = false)
    val role: String = "USER",

    @Column(name = "created_at", updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)