import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DoneIcon from "@mui/icons-material/Done";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";

import {
  useChatList,
  fetchConversations,
  fetchMessages,
  sendMessage,
  startOrGetConversation,
  formatChatTime,
} from "../services/chatService";
import { fa, faCount } from "../utils/fa";

const NAVY = "#071739";
const NAVY_HOVER = "#0E2452";
const BEIGE = "#E3C39D";
const MUTED = "#4B6382";
const BORDER = "#CDD5DB";

export default function Chat() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { conversations, totalUnread } = useChatList();
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showMobileList, setShowMobileList] = useState(true);

  const messagesEndRef = useRef(null);

  const targetUserId = searchParams.get("user");
  const targetUserName = searchParams.get("userName");
  const targetProjectId = searchParams.get("project");
  const targetProjectTitle = searchParams.get("projectTitle");

  const activeConvId =
    selectedConvId ?? (!isMobile && conversations.length > 0 ? conversations[0].id : null);

  // Initial load of conversations
  useEffect(() => {
    fetchConversations();
  }, []);

  // Handle URL query parameters (?user=...&project=...)
  useEffect(() => {
    if (!targetUserId) return;
    let cancelled = false;
    startOrGetConversation(
      targetUserId,
      targetProjectId,
      targetUserName
        ? {
            id: targetUserId,
            username: targetUserId,
            display_name: targetUserName,
          }
        : null,
      targetProjectTitle
        ? {
            id: targetProjectId,
            title: targetProjectTitle,
            status: "open",
          }
        : null
    ).then((conv) => {
      if (!cancelled && conv) {
        setSelectedConvId(conv.id);
        setShowMobileList(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [targetUserId, targetProjectId, targetUserName, targetProjectTitle]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConvId) return;
    let cancelled = false;
    fetchMessages(activeConvId).then((data) => {
      if (!cancelled) {
        setMessages(data || []);
        setLoadingMessages(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [activeConvId]);

  // Newest message stays in view: jump straight to it when a chat opens,
  // glide only when a new message arrives in the chat already open.
  const lastScrolledConv = useRef(null);
  useEffect(() => {
    // Scroll only the message list, never the whole page.
    const list = messagesEndRef.current?.parentElement;
    if (!list || !messages.length) return;
    const opened = lastScrolledConv.current !== activeConvId;
    lastScrolledConv.current = activeConvId;
    list.scrollTo({ top: list.scrollHeight, behavior: opened ? "auto" : "smooth" });
  }, [messages, activeConvId]);

  const activeConversation = conversations.find((c) => String(c.id) === String(activeConvId));

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const name = c.other_participant?.display_name || c.other_participant?.username || "";
    const projectTitle = c.project?.title || "";
    const query = searchQuery.toLowerCase();
    return name.toLowerCase().includes(query) || projectTitle.toLowerCase().includes(query);
  })
    // Most recent conversation first, like any messaging app.
    .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    const text = inputText;
    setInputText("");

    const newMsg = await sendMessage(activeConvId, text);
    if (newMsg) {
      setMessages((prev) => [...prev, newMsg]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectConv = (id) => {
    // Re-clicking the open chat must not show "loading" (the load effect would not run again).
    if (String(id) !== String(activeConvId)) {
      setSelectedConvId(id);
      setLoadingMessages(true);
    }
    if (isMobile) {
      setShowMobileList(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", width: "100%", pb: 3 }}>
      {/* Page Title */}
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 2.5, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: NAVY }}>
            گفت‌وگو و مذاکره
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 14 }}>
            ارتباط مستقیم و تبادل نظر با اعضای تیم و مدیران پروژه‌ها
          </Typography>
          {/* Own line: a "·" before Persian digits reads like the digit zero (۰). */}
          {totalUnread > 0 && (
            <Typography sx={{ mt: 0.5, fontSize: 14, fontWeight: 600, color: NAVY }}>
              {fa(totalUnread)} پیام خوانده‌نشده
            </Typography>
          )}
        </Box>
      </Stack>

      {/* Main Chat Card */}
      <Card
        sx={{
          // On a phone the list alone needs no fixed height (it left a big empty box).
          // Phone: one full-height card in both views (list and thread), no footer below it.
          height: { xs: "calc(100dvh - 190px)", md: 620 },
          minHeight: { xs: 420, md: 520 },
          display: "flex",
          overflow: "hidden",
          border: `1px solid ${BORDER}`,
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(7, 23, 57, 0.05)",
          bgcolor: "#fff",
        }}
      >
        {/* Conversations List Panel */}
        {(!isMobile || showMobileList) && (
          <Box
            sx={{
              width: { xs: "100%", md: 340 },
              borderLeft: `1px solid ${BORDER}`,
              display: "flex",
              flexDirection: "column",
              bgcolor: "#FFFFFF",
              flexShrink: 0,
            }}
          >
            {/* Search Input */}
            <Box sx={{ p: 2, borderBottom: `1px solid ${BORDER}` }}>
              <TextField
                size="small"
                fullWidth
                placeholder="جست‌وجوی گفت‌وگوها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: MUTED, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  bgcolor: "#F5F8FA",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    fontSize: 14,
                  },
                }}
              />
            </Box>

            {/* List */}
            <Box sx={{ flex: 1, overflowY: "auto" }}>
              {filteredConversations.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 6, px: 2 }}>
                  <ForumOutlinedIcon sx={{ fontSize: 40, color: MUTED, mb: 1, opacity: 0.6 }} />
                  <Typography variant="body2" color="text.secondary">
                    گفت‌وگویی یافت نشد
                  </Typography>
                </Box>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = String(conv.id) === String(activeConvId);
                  const name = conv.other_participant?.display_name || conv.other_participant?.username || "همکار";
                  const initial = name.trim()[0] || "ت";
                  const lastMsg = conv.last_message?.content || "مکالمه آغاز نشده است";
                  const time = formatChatTime(conv.last_message?.created_at || conv.updated_at);
                  const unread = conv.unread_count || 0;

                  return (
                    <Box
                      key={conv.id}
                      onClick={() => handleSelectConv(conv.id)}
                      sx={{
                        p: 2,
                        cursor: "pointer",
                        borderBottom: `1px solid ${BORDER}`,
                        bgcolor: isSelected ? "rgba(7, 23, 57, 0.04)" : "transparent",
                        borderRight: isSelected ? `4px solid ${NAVY}` : "4px solid transparent",
                        transition: "all 0.15s ease",
                        "&:hover": {
                          bgcolor: isSelected ? "rgba(7, 23, 57, 0.05)" : "#F8FAFC",
                        },
                      }}
                    >
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
                        <Badge badgeContent={faCount(unread)} invisible={!unread} color="error" overlap="circular">
                          <Avatar
                            sx={{
                              width: 44,
                              height: 44,
                              bgcolor: BEIGE,
                              color: NAVY,
                              fontWeight: 700,
                              fontSize: 17,
                            }}
                          >
                            {initial}
                          </Avatar>
                        </Badge>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "baseline", mb: 0.4 }}>
                            <Typography sx={{ fontWeight: isSelected || unread > 0 ? 700 : 600, fontSize: 14.5, color: NAVY }} noWrap>
                              {name}
                            </Typography>
                            <Typography sx={{ fontSize: 11, color: MUTED, flexShrink: 0, mr: 0.5 }}>
                              {time}
                            </Typography>
                          </Stack>

                          {conv.project && (
                            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", mb: 0.5 }}>
                              <FolderOpenOutlinedIcon sx={{ fontSize: 13, color: "#786045" }} />
                              <Typography sx={{ fontSize: 11.5, color: "#786045", fontWeight: 500 }} noWrap>
                                {conv.project.title}
                              </Typography>
                            </Stack>
                          )}

                          <Typography
                            variant="body2"
                            sx={{
                              color: unread > 0 ? NAVY : MUTED,
                              fontWeight: unread > 0 ? 600 : 400,
                              fontSize: 13,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {lastMsg}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  );
                })
              )}
            </Box>
          </Box>
        )}

        {/* Active Chat Conversation Area */}
        {(!isMobile || !showMobileList) && (
          <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", bgcolor: "#F5F8FA" }}>
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#FFFFFF",
                    borderBottom: `1px solid ${BORDER}`,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", minWidth: 0 }}>
                    {isMobile && (
                      <IconButton onClick={() => setShowMobileList(true)} sx={{ color: NAVY, mr: 0.5 }} size="small">
                        <ArrowForwardIcon />
                      </IconButton>
                    )}

                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: BEIGE,
                        color: NAVY,
                        fontWeight: 700,
                        fontSize: 16,
                      }}
                    >
                      {(activeConversation.other_participant?.display_name || "ت").trim()[0]}
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography noWrap sx={{ fontWeight: 700, fontSize: 15.5, color: NAVY }}>
                        {activeConversation.other_participant?.display_name || activeConversation.other_participant?.username}
                      </Typography>
                      <Typography variant="caption" sx={{ color: MUTED, display: "block" }}>
                        <bdi dir="ltr">@{activeConversation.other_participant?.username || "همکار"}</bdi>
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Project negotiation chip */}
                  {activeConversation.project && (
                    <Chip
                      icon={<FolderOpenOutlinedIcon sx={{ fontSize: 16 }} />}
                      label={`پروژه: ${activeConversation.project.title}`}
                      onClick={() => navigate(`/projects/${activeConversation.project.id}`)}
                      size="small"
                      sx={{
                        bgcolor: "rgba(227, 195, 157, 0.3)",
                        color: "#786045",
                        fontWeight: 600,
                        fontSize: 12,
                        maxWidth: "100%",
                        cursor: "pointer",
                        "&:hover": { bgcolor: "rgba(227, 195, 157, 0.5)" },
                      }}
                    />
                  )}
                </Box>

                {/* Messages Body */}
                <Box sx={{ flex: 1, p: 2.5, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {loadingMessages ? (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                      <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                        در حال بارگذاری پیام‌ها...
                      </Typography>
                    </Box>
                  ) : messages.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 8, px: 2 }}>
                      <ForumOutlinedIcon sx={{ fontSize: 48, color: MUTED, opacity: 0.4, mb: 1 }} />
                      <Typography sx={{ fontWeight: 600, color: NAVY, mb: 0.5 }}>
                        آغاز گفت‌وگو و مذاکره
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        پیامی بنویسید تا تبادل نظر درباره این همکاری آغاز شود.
                      </Typography>
                    </Box>
                  ) : (
                    messages.map((msg) => {
                      const isMine = msg.is_mine;
                      return (
                        <Box
                          key={msg.id}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: isMine ? "flex-end" : "flex-start",
                            maxWidth: "100%",
                          }}
                        >
                          <Box
                            sx={{
                              maxWidth: { xs: "85%", md: "70%" },
                              p: 1.6,
                              borderRadius: 2.5,
                              borderBottomLeftRadius: isMine ? 2.5 : 0.5,
                              borderBottomRightRadius: isMine ? 0.5 : 2.5,
                              bgcolor: isMine ? NAVY : "#FFFFFF",
                              color: isMine ? "#FFFFFF" : NAVY,
                              border: isMine ? "none" : `1px solid ${BORDER}`,
                              boxShadow: isMine
                                ? "0 2px 8px rgba(7, 23, 57, 0.15)"
                                : "0 1px 4px rgba(0, 0, 0, 0.04)",
                            }}
                          >
                            <Typography sx={{ fontSize: 14, lineHeight: 1.6, wordBreak: "break-word" }}>
                              {msg.content}
                            </Typography>

                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent={isMine ? "flex-start" : "flex-end"}
                              spacing={0.5}
                              sx={{ mt: 0.6 }}
                            >
                              <Typography
                                sx={{
                                  fontSize: 10.5,
                                  color: isMine ? "rgba(227, 195, 157, 0.9)" : MUTED,
                                  fontWeight: 500,
                                }}
                              >
                                {formatChatTime(msg.created_at)}
                              </Typography>
                              {isMine && (
                                <DoneIcon sx={{ fontSize: 13, color: "rgba(227, 195, 157, 0.9)" }} />
                              )}
                            </Stack>
                          </Box>
                        </Box>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Input Area */}
                <Box
                  component="form"
                  onSubmit={handleSend}
                  sx={{
                    p: 2,
                    bgcolor: "#FFFFFF",
                    borderTop: `1px solid ${BORDER}`,
                    display: "flex",
                    gap: 1.5,
                    alignItems: "flex-end",
                  }}
                >
                  <TextField
                    multiline
                    maxRows={4}
                    fullWidth
                    size="small"
                    placeholder="پیام خود را بنویسید... (Enter برای ارسال)"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    sx={{
                      bgcolor: "#F5F8FA",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        fontSize: 14.5,
                        lineHeight: 1.5,
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!inputText.trim()}
                    sx={{
                      bgcolor: NAVY,
                      color: "#FFFFFF",
                      height: 40,
                      minWidth: 44,
                      px: 2,
                      borderRadius: 2,
                      "&:hover": { bgcolor: NAVY_HOVER },
                      "&.Mui-disabled": { bgcolor: "rgba(7, 23, 57, 0.2)", color: "#FFFFFF" },
                    }}
                  >
                    <SendOutlinedIcon sx={{ fontSize: 20, transform: "scaleX(-1)" }} />
                  </Button>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 3,
                  textAlign: "center",
                }}
              >
                <ForumOutlinedIcon sx={{ fontSize: 64, color: MUTED, opacity: 0.35, mb: 2 }} />
                <Typography variant="h6" sx={{ color: NAVY, fontWeight: 700, mb: 1 }}>
                  صفحه گفت‌وگو و مذاکره پروژه
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 400, fontSize: 14 }}>
                  برای شروع، یکی از مخاطبین را از فهرست انتخاب کنید یا از صفحه جزئیات پروژه‌ها، گفت‌وگوی جدیدی با صاحب پروژه آغاز نمایید.
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Card>
    </Box>
  );
}
