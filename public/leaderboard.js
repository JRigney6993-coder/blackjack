function updateLeaderboard() {
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', "http://localhost:4001/game/topPlayers", true);
                    xhr.onload = function () {
                        if (xhr.status >= 200 && xhr.status < 400) {
                            var players = JSON.parse(xhr.responseText);
                            var leaderboardElement = document.getElementById("leaderboard");

                            // Clear existing leaderboard entries.
                            leaderboardElement.innerHTML = "";

                            for (var i = 0; i < players.length; i++) {
                                var player = players[i];
                                var li = document.createElement("li");
                                li.textContent = (i + 1) + ". " + player.first_name + " " + player.last_name + " - Difference: " + player.difference;
                                leaderboardElement.appendChild(li);
                            }
                        } else {
                            console.error("Server returned an error:", xhr.statusText);
                        }
                    };

                    xhr.onerror = function () {
                        console.error("Connection error");
                    };

                    xhr.send();
                }

                // When the page loads, update the leaderboard.
                document.addEventListener("DOMContentLoaded", function () {
                    updateLeaderboard();
                });