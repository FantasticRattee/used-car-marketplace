const teamMembers = [
    {
      name: "Rattee Watperatam",
      id: "6688141",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/cc81e15a417a433793d315a36fddff83/879c1ea9057e7f293c75c37876fd7b475a8b5bbd",
    },
    {
      name: "Naruebordint Veangnont",
      id: "6688139",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/cc81e15a417a433793d315a36fddff83/bd815f6c95049114dacb1f362c320a153096509b",
    },
    {
      name: "Nichakan Ninhusrungsri",
      id: "6688070",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/cc81e15a417a433793d315a36fddff83/2b0edec79ebc2e5d13ccf2d4fd27405ab443070d",
    },
    {
      name: "Nattapat Krisanasamit",
      id: "6688051",
      imageUrl: "https://cdn.builder.io/api/v1/image/assets/cc81e15a417a433793d315a36fddff83/4a91f07aa1b3b58c1291dd78fd7d7b89d1dc876a",
    },
  ];
  
  function createTeamMemberCard(member) {
    return `
      <article class="team-member">
        <img src="${member.imageUrl}" alt="${member.name}'s profile" class="member-image">
        <h3 class="member-name">${member.name}</h3>
        <p class="member-id">ID : ${member.id}</p>
      </article>
    `;
  }
  
  function renderTeamMembers() {
    const container = document.querySelector('.team-grid-container');
    const membersHTML = teamMembers.map(createTeamMemberCard).join('');
    container.innerHTML = membersHTML;
  }
  
  // Initialize the page
  document.addEventListener('DOMContentLoaded', renderTeamMembers);
  