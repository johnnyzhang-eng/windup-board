# 09 · 竞品 Holonic-Asset · 角色设计全记录 + 能否用进我们 pipeline

> 对象：同营另一组 `1024XEngineer/Holonic-Asset`（公开）。定位=以 Project 为核心的"一站式 2D 游戏资产 生成+管理"平台（全资产类型：Character/UI/Scene/Object/Tileset/动画/音乐音效）。
> 来源：产品提案 PR#15（doc/zh/MS1-ProductProposal.md）、系统架构 PR#24（docs/zh/system-architecture-design.md）、生成工作流 Issue#20。记录于 2026-07-15。
> 目的：把他们**角色相关**的设计全记下，逐条判断能否借进 Windux pipeline。中性事实，不评人。

## 一、他们的角色模型（文档所载全部）

**1. 角色是 Project 下的一种 Asset**，继承 Project 统一上下文：游戏类型(RPG/ACT/SLG)、美术风格、**视角 ViewType(TopDown/SideView/Isometric)**、像素规格、目标平台、参考图 —— 自动喂给生成，保项目内风格一致。

**2. 角色生成请求 `CharacterGenerationRequest`**（架构 PR#24 原文字段）：
```
ProjectPrompt  项目提示词（Project 上下文）
UserPrompt     用户本次描述
Name           名字
Facing         朝向（单个字符串）
Size           尺寸
Reference[]    参考图（多张）
Physics        PhysicsConfig{ Collision, Movement, Gravity }
```
- **亮点：角色带 `Facing` + `Physics{碰撞/移动/重力}`** —— 把角色**进游戏后的移动/物理**也纳入生成请求。
- **但：`CollisionConfig/MovementConfig/GravityConfig` 三个子结构文档里只引用、未定义字段** = 只有意图、没落地。
- **无 `CharacterGenerationResponse`**：角色生成"产出什么"（单图？帧？sheet？）未定义。

**3. 生成动画**：`AI 服务`能力清单里列了"生成动画"，**但没有任何动画生成接口/请求结构/管线**（不像 UI/Scene/Object 都给了 Request/Response struct）。→ 动画生成他们**尚未设计**。

**4. 多方向**：只做在 `Object`（`Derictions` 1/4/8 + `View`）；**角色本身只有单个 `Facing` 字符串，没有多方向结构**。

**5. 角色的资产化能力**（产品提案）：
- 围绕同一 Asset **持续迭代**（局部重绘+人工微调，不每次出新图）。
- **Record 版本管理**：每次 AI 生成产生 Record，可看历史/回退/基于历史 copy 新 Asset。
- **资产关系**：AI 自动建"角色↔动画/武器/音效"从属+关联，生成时自动引用作上下文。
- Tag 分类 + ES 搜索；导出 PNG/GIF/Spritesheet/Tileset/JSON→Unity/Godot。

## 二、和我们（Windup）的根本差异
| | Holonic-Asset | Windup（我们） |
|---|---|---|
| 定位 | 宽：全资产类型 + 管理/版本/关系/搜索 | 深：角色一致性 + 动画 + 进引擎 |
| 生成路线 | 未细化；#20 是"多图拼一张→单次生成→切分"批量风格一致 | route A逐帧 / route B视频，带 DreamSim 尺子做 A/B |
| 一致性 | 靠 Project 上下文 + 参考图（无度量） | **可量化**（DreamSim 身份漂移 + 多信号评判 E1） |
| 动画 | 列为能力、未设计 | **已跑通**（逐帧/视频、抠图/对齐/循环/成品 GIF+sheet） |
| 角色移动/物理 | **有意图**（Facing+Physics，未落地） | 无（止于帧） |

## 三、能否用进我们 pipeline（逐条判）

**✅ 值得借（现在就该纳入）**
1. **Project 级统一风格上下文**：把"游戏类型/美术风格/视角/像素规格/平台/参考图"提到 Project 层自动下发——比我们只在角色卡管身份更进一步，保多角色跨批次风格一致。我们 proposal 有"项目级风格约束"提法，可据此正式建模。
2. **`Facing` 显式化 + 多方向结构**：把朝向做成一等字段，并像他们 Object 的 `Derictions(1/4/8)` 那样给**角色**加多方向——正好对上我们 **E7 多方向/转身**。（他们角色只有单 Facing，是缺口，我们可做得比他们全。）
3. **`Size`/像素规格作为参数** 与我们 [[08-帧数与风格分辨率匹配]] 联动：分辨率同时决定**帧数**和 sprite 尺寸，串成一条"风格→分辨率→帧数"的契约参数链。
4. **资产关系"角色↔动画/穿戴/音效"当生成上下文**：呼应老师 PR#2"检查/通过做在动作层、动作是可复用交付单元"，也对上我们造型/穿戴/动作分层。可在架构 #3 的数据模型里补关系边。
5. **Record 版本/回退/分支**：比我们"生成批次"更完整的版本模型，可参考。

**🟡 有意思但先别做（P2/未来，防 scope creep）**
6. **角色 Physics{碰撞/移动/重力}**：交付"帧 + 进游戏移动/物理提示"是差异化想法，但已超 MS1（我们本期止于序列帧+对齐+导出）。记为未来扩展；且他们自己也没落地。

**🟢 我们本就领先、要守住的**
7. 一致性可**量化**（DreamSim/多信号 E1）、**单帧可重画**、**进引擎最后一公里**（抠图/对齐/循环/成品）、动画**真跑通**——这些正是他们空的地方，是我们的差异化护城河。

## 四、一句话
他们**宽、强在管理/上下文/版本/关系**；我们**深、强在一致性度量+动画落地+进引擎**。借他们的 **Project 上下文 + 多方向 + 资产关系 + 版本模型**补齐我们的"平台骨架"，同时守住我们的"角色深度"，差异化最清晰。
