import sys

file_path = sys.argv[1]

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

out = []
state = "normal"
for line in lines:
    if line.startswith("<<<<<<< Updated upstream"):
        state = "skip_upstream"
    elif line.startswith("======="):
        state = "keep_stashed"
    elif line.startswith(">>>>>>> Stashed changes"):
        state = "normal"
    else:
        if state == "normal" or state == "keep_stashed":
            out.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(out)

print("Conflicts resolved in", file_path)
