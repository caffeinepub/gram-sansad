import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Debug "mo:core/Debug";

actor {
  // Initialize persistent storage and access control
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type (required by frontend)
  public type UserProfile = {
    name : Text;
    fatherName : Text;
    age : Nat;
    mobileNumber : Text;
    whatsappNumber : Text;
    state : Text;
    district : Text;
    village : Text;
    aadharPhoto : Storage.ExternalBlob;
  };

  // User Registration Data Type
  type UserRegistration = {
    name : Text;
    fatherName : Text;
    age : Nat;
    mobileNumber : Text;
    whatsappNumber : Text;
    state : Text;
    district : Text;
    village : Text;
    aadharPhoto : Storage.ExternalBlob;
  };

  // Announcement & Chat Types
  type Announcement = {
    id : Nat;
    message : Text;
  };

  type ChatMessageContent = {
    #text : Text;
    #photo : Storage.ExternalBlob;
    #video : Storage.ExternalBlob;
  };

  type PollOption = {
    id : Nat;
    text : Text;
  };

  type Poll = {
    question : Text;
    options : [PollOption];
    votes : Map.Map<Nat, Nat>;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let userRegistrations = Map.empty<Principal, UserRegistration>();
  let announcements = Map.empty<Nat, Announcement>();
  let chatMessages = List.empty<ChatMessageContent>();
  let pollMap = Map.empty<Nat, Poll>();

  var nextAnnouncementId = 0;
  var nextPollId = 0;

  // User Profile Management (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // ! The saveCallerUserProfile is required by the frontend to make the overall portal compatible. Leave this as is.
  // This is automatically handled on the first login. See the type as reference for default values.
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // User Registration
  public shared ({ caller }) func registerUser(data : UserRegistration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register");
    };
    if (userRegistrations.containsKey(caller)) {
      Runtime.trap("User already registered. To change registration information, update the existing registration");
    };
    userRegistrations.add(caller, data);
  };

  // Announcements
  public shared ({ caller }) func postAnnouncement(message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can post announcements");
    };
    let announcement = {
      id = nextAnnouncementId;
      message;
    };
    announcements.add(nextAnnouncementId, announcement);
    nextAnnouncementId += 1;
  };

  public query ({ caller }) func getAnnouncements() : async [Announcement] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view announcements");
    };
    announcements.values().toArray();
  };

  // Chat
  public shared ({ caller }) func sendMessage(content : ChatMessageContent) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };
    chatMessages.add(content);
  };

  public query ({ caller }) func getChat() : async [ChatMessageContent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view chat");
    };
    chatMessages.toArray();
  };

  // Polls
  public shared ({ caller }) func createPoll(question : Text, options : [PollOption]) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create polls");
    };

    let votes = Map.empty<Nat, Nat>();
    let poll = {
      question;
      options;
      votes;
    };

    pollMap.add(nextPollId, poll);
    let pollId = nextPollId;
    nextPollId += 1;
    pollId;
  };

  public shared ({ caller }) func voteInPoll(pollId : Nat, optionId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can vote in polls");
    };
    switch (pollMap.get(pollId)) {
      case (null) { Runtime.trap("Poll not found") };
      case (?poll) {
        // Check if the option exists
        let optionExists = poll.options.find(func(o) { o.id == optionId });
        switch (optionExists) {
          case (null) {
            Runtime.trap("Option not found");
          };
          case (_) {
            // Count the vote
            let currentVotes = switch (poll.votes.get(optionId)) {
              case (null) { 0 };
              case (?count) { count };
            };
            poll.votes.add(optionId, currentVotes + 1);
          };
        };
      };
    };
  };

  public query ({ caller }) func getPollResults(pollId : Nat) : async { question : Text; options : [PollOption]; votes : [(Nat, Nat)] } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view poll results");
    };
    switch (pollMap.get(pollId)) {
      case (null) { Runtime.trap("Poll not found") };
      case (?poll) {
        {
          question = poll.question;
          options = poll.options;
          votes = poll.votes.toArray();
        };
      };
    };
  };
};
