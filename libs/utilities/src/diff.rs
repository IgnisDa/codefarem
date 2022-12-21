use similar::{ChangeTag, TextDiff};

pub fn get_diff_of_lines(line1: &'_ str, line2: &'_ str) -> String {
    let diff = TextDiff::from_lines(line1, line2);

    diff.iter_all_changes()
        .map(|change| {
            let sign = match change.tag() {
                ChangeTag::Delete => "-",
                ChangeTag::Insert => "+",
                ChangeTag::Equal => " ",
            };
            format!("{}{}", sign, change)
        })
        .collect()
}
