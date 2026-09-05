import toast from "react-hot-toast"

function ChatPage() {
  return (
    <div>
      chat page
      <button onClick={()=>toast.success("clicked")}>click me</button>
    </div>
  )
}

export default ChatPage
