window.StudioEntries.log[12] = `
<article class="real-entry project-log-entry"><p class="project-log-kicker">PROGRAMMING DREAM · WEEK 12 · 2026 / 11 / 24</p>
<section><h2>01 / XBOX INPUT MAPPING</h2><figure class="project-log-wide"><a href="./assets/working-log/week12/controller.webp" target="_blank" rel="noopener"><img src="./assets/working-log/week12/controller.webp" alt="Programming Dream Xbox controller guide" loading="lazy"></a><figcaption>Programming Dream Xbox controller guide</figcaption></figure><div class="prototype-table-scroll" tabindex="0"><table class="prototype-table"><thead><tr><th>Xbox Input</th><th>Input Action (IA)</th><th>Function</th></tr></thead><tbody>
<tr><td>Left Stick (LS)</td><td><code>IA_Move</code></td><td>Move the player (WASD)</td></tr>
<tr><td>Right Stick (RS)</td><td><code>IA_Look</code></td><td>Rotate the camera / Look around</td></tr>
<tr><td>X Button</td><td><code>IA_Interact</code></td><td>Interact with the computer (E)</td></tr>
<tr><td>B Button</td><td><code>IA_Back</code></td><td>Back / Cancel (Q)</td></tr>
<tr><td>Y Button</td><td><code>IA_Information</code></td><td>View object information (F)</td></tr>
<tr><td>A Button</td><td><code>IA_Confirm</code></td><td>Click the Confirm button in Canvas UI</td></tr>
<tr><td>Left Stick (LS)</td><td><code>IA_CursorMove</code></td><td>Move the virtual mouse cursor in Drawing Mode</td></tr>
<tr><td>A Button</td><td><code>IA_MouseClick</code></td><td>Simulate left mouse click; hold to draw and release to stop drawing</td></tr>
<tr><td>D-pad Up</td><td><code>IA_ScrollUp</code></td><td>Scroll up in Menu UI — Settings</td></tr>
<tr><td>D-pad Down</td><td><code>IA_ScrollDown</code></td><td>Scroll down in Menu UI — Settings</td></tr>
<tr><td>View / Menu / Share</td><td>Unassigned</td><td>No function</td></tr>
</tbody></table></div></section>
<section><h2>02 / PLAYER CONTROLLER PARAMETERS</h2><div class="prototype-table-scroll" tabindex="0"><table class="prototype-table"><thead><tr><th>Parameter</th><th>current</th><th>C++ default</th><th>Function</th></tr></thead><tbody>
<tr><td>Move Speed</td><td><code>520</code></td><td><code>520</code></td><td>玩家最大移动速度，约 5.2 m/s</td></tr>
<tr><td>Acceleration Response</td><td><code>5.5</code></td><td><code>5.5</code></td><td>起步响应；越大越快达到最大速度</td></tr>
<tr><td>Deceleration Response</td><td><code>7.0</code></td><td><code>7.0</code></td><td>松开摇杆/按键后的停止速度</td></tr>
<tr><td>Mouse Sensitivity</td><td><code>1.0</code></td><td><code>0.12</code></td><td>当前鼠标视角灵敏度；蓝图已经覆盖 C++ 默认值</td></tr>
<tr><td>Vertical Look Multiplier</td><td><code>1.05</code></td><td><code>1.05</code></td><td>鼠标垂直视角速度倍率</td></tr>
<tr><td>Gamepad Look Yaw Rate</td><td><code>120°/s</code></td><td><code>120°/s</code></td><td>RS 推满时水平旋转速度</td></tr>
<tr><td>Gamepad Look Pitch Rate</td><td><code>90°/s</code></td><td><code>90°/s</code></td><td>RS 推满时垂直旋转速度</td></tr>
<tr><td>Invert Gamepad Look Y</td><td><code>False</code></td><td><code>False</code></td><td>是否反转 RS 上下视角</td></tr>
<tr><td>Minimum View Pitch</td><td><code>-88°</code></td><td><code>-88°</code></td><td>最低视角</td></tr>
<tr><td>Maximum View Pitch</td><td><code>+88°</code></td><td><code>+88°</code></td><td>最高视角</td></tr>
<tr><td>Camera FOV</td><td><code>90°</code></td><td><code>90°</code></td><td>第一人称视野角度</td></tr>
<tr><td>Camera Height</td><td><code>64</code></td><td><code>64</code></td><td>摄像机相对胶囊体高度</td></tr>
<tr><td>Capsule Radius / Half Height</td><td><code>34 / 88</code></td><td><code>34 / 88</code></td><td>玩家碰撞体尺寸</td></tr>
<tr><td>Floating Height</td><td><code>8.0</code></td><td><code>5.0</code></td><td>静止时摄像机漂浮幅度；蓝图已覆盖</td></tr>
<tr><td>Moving Floating Height</td><td><code>14.0</code></td><td><code>14.0</code></td><td>移动时漂浮幅度</td></tr>
<tr><td>Floating Side Amount</td><td><code>0.28</code></td><td><code>0.28</code></td><td>左右漂浮比例</td></tr>
<tr><td>Floating Frequency</td><td><code>0.7</code></td><td><code>0.55</code></td><td>漂浮速度；蓝图已覆盖</td></tr>
</tbody></table></div></section>
<section><h2>03 / UI PROGRESS</h2><div class="project-log-gallery"><figure><a href="./assets/working-log/week12/bunny-info.webp" target="_blank" rel="noopener"><img src="./assets/working-log/week12/bunny-info.webp" alt="Added a reference image to the Stanford Bunny information panel." loading="lazy"></a><figcaption>Added a reference image to the Stanford Bunny information panel.</figcaption></figure><figure><a href="./assets/working-log/week12/settings.webp" target="_blank" rel="noopener"><img src="./assets/working-log/week12/settings.webp" alt="Added the Xbox input guide to Settings." loading="lazy"></a><figcaption>Added the Xbox input guide to Settings.</figcaption></figure></div></section>
<section><h2>04 / NEXT</h2><p>Write the Programming Dream paper.</p></section><footer class="entry-footer">Programming Dream · Development Log</footer></article>`;
