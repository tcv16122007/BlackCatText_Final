package com.blackcat.text.entity

data class ChatMessage(
    val sender: String,
    val content: String,
    val type: String = "CHAT"
)